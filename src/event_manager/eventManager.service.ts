import { Client, CommandInteraction, Guild, Message, MessageEmbed, TextChannel } from "discord.js";
import { DateTime, Duration } from "luxon";
import { injectable } from "tsyringe";

import { Task } from "../shared/models/task.js";
import { fetchMessages } from "../shared/utils.js";
import { EventManagerRepository } from "./eventManager.repository.js";
import { EventManagerConfig, EventObj, Tags } from "./models/index.js";

@injectable()
export class EventManagerService {

    constructor(private eventManagerRepository: EventManagerRepository) {
    }

    private static parseTriggerDuration(triggerTime: string) {
        const hold = DateTime.fromFormat(triggerTime, "HH:mm");
        return Duration.fromObject({ hours: hold.get("hour"), minutes: hold.get("minute") });
    }

    private parseMessage(messageId: string, content: string, config: EventManagerConfig): EventObj {
        const event = new EventObj(messageId);
        const hammerRegex = /<.*:(\d+):.*>/;
        const [ l, r ] = config.delimiterCharacters as [ string, string ];
        const re = new RegExp(`${l}(.*)${r}([^${l}]*)`, "gm");

        const patternSplit: [ string | null, string | null ][] = (content?.match(re) ?? []).map(l => {
            re.lastIndex = 0;
            const match = re.exec(l).slice(1, 3) ?? [ null, null ];
            return [ match[0]?.trim(), match[1]?.trim() ];
        });

        for (const [ key, value ] of patternSplit) {
            let date: DateTime, matchedResult: RegExpMatchArray, unixTimeStr: string, number: number;
            switch (key) {
                case config.tags.announcement:
                    event.name = value;
                    break;

                case config.tags.description:
                    event.description = value;
                    break;

                case config.tags.dateTime:
                    if (config.dateTimeFormat.length > 0) {
                        date = DateTime.fromFormat(value, config.dateTimeFormat, {});
                        if (date.isValid) {
                            event.dateTime = date.toUnixInteger();
                            break;
                        }
                    }

                    // Checks if it's hammer time.
                    matchedResult = value?.match(hammerRegex);

                    if (!matchedResult) break;
                    unixTimeStr = matchedResult[1];
                    if (!unixTimeStr) break;
                    number = Number(unixTimeStr);
                    if (isNaN(number)) break;

                    date = DateTime.fromSeconds(number);
                    if (!date.isValid) break;
                    event.dateTime = date.toUnixInteger();
                    break;

                default:
                    if (!config.tags.exclusionList.every(e => e !== key)) continue;
                    event.additional.push([ key, value ]);
                    break;
            }
        }

        return event;
    }

    private async getConfig(guildId: string) {
        if (guildId == null || !guildId.trim()) throw new ReferenceError("guildId cannot be null nor empty.");

        return this.findOneOrCreate(guildId);
    }

    public async createEvent(message: Message) {
        if (message.author.id === message.client.application?.id) return;
        if (!message.guildId) return;
        const config = await this.getConfig(message.guildId);

        if (config.listenerChannelId !== message.channelId) return;
        const [ l, r ]: string[] = config.delimiterCharacters as string[];

        const matchTags: string[] = (message.content?.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g")) ?? []).map(l => l.trim());
        if (!matchTags.includes((config.tags as Tags).announcement)) return;

        const event: EventObj = this.parseMessage(message.id, message.content, config);
        try {
            if (EventObj.isValid(event)) {
                config.events.push(event);
                await message.react("✅");
                await this.eventManagerRepository.save(config);
            } else {
                await message.react("❎");
            }
        } catch (e) {
            console.error(e);
        }
    }

    public async updateEvent(oldMessage: Message, newMessage: Message) {
        if (oldMessage.partial) await oldMessage.fetch();
        if (newMessage.partial) await newMessage.fetch();

        const config = await this.getConfig(oldMessage.guildId);

        if (config.listenerChannelId !== oldMessage.channelId) return;
        const oldEvent = config.events.find(event => event.messageId === oldMessage.id);
        if (!oldEvent) return;

        const newEvent = this.parseMessage(oldMessage.id, newMessage.content, config);

        try {
            const reaction = newMessage.reactions.cache.find(reaction => reaction.me);
            if (reaction)
                await reaction.users.remove(oldMessage.client.user?.id);

            if (EventObj.isValid(newEvent)) {
                await newMessage.react("✅");
                config.events[config.events.indexOf(oldEvent)] = newEvent;
                await this.eventManagerRepository.save(config);
            } else {
                await newMessage.react("❎");
            }
        } catch (error) {
            console.error(error);
        }
    }

    public async deleteEvent(message: Message) {
        if (message.partial) await message.fetch();
        const config = await this.getConfig(message.guildId);

        if (!config.events.find(event => event.messageId === message.id)) return;

        config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
        await this.eventManagerRepository.save(config);
    }

    public async reminderLoop(client: Client) {
        await Task.waitTillReady(client);

        const now: DateTime = DateTime.now();
        const configs = await this.eventManagerRepository.find({});
        const alteredConfigs = [];

        for (const config of configs) {
            try {
                if (!client.guilds.cache.has(config.guildId)) continue;
                const postingGuild: Guild = await client.guilds.fetch(config.guildId);
                if (!postingGuild) continue;
                if (config.events.length > 0 && config.postingChannelId) {
                    const postingChannel: TextChannel | null = await postingGuild.channels.fetch(config.postingChannelId) as TextChannel | null;
                    if (!postingChannel) continue;

                    for (const trigger of config.reminders) {
                        if (!trigger.timeDelta) continue;
                        const triggerTime = EventManagerService.parseTriggerDuration(trigger.timeDelta);
                        for (const event of config.events) {
                            const eventTime = DateTime.fromSeconds(event.dateTime);
                            if (Math.abs(eventTime.diff(now, "days").get("day")) > 1) continue;
                            if (eventTime.get("minute") === triggerTime.as("minutes")) {
                                const messageValues: { [key: string]: string } = {
                                    "%everyone%": "@everyone",
                                    "%eventName%": event.name,
                                    "%hourDiff%": triggerTime.get("hours").toString(),
                                    "%minuteDiff%": triggerTime.get("minutes").toString(),
                                };

                                await postingChannel.send(trigger.message.replace(/%\w+%/g, (v) => messageValues[v] || v));
                            }
                        }
                    }
                }

                const before = config.events.length;

                for (const past of config.events.filter(event => now >= DateTime.fromSeconds(event.dateTime)))
                    config.events.splice(config.events.indexOf(past), 1);

                if (before !== config.events.length)
                    alteredConfigs.push(config);
            } catch (err) {
                console.error(err);
            }
        }

        if (alteredConfigs.length > 0) {
            await this.eventManagerRepository.bulkSave(alteredConfigs);
        }
    }

    public async listEvents(interaction: CommandInteraction) {
        const config = await this.getConfig(interaction.guildId);

        const embed: MessageEmbed = new MessageEmbed().setColor("RANDOM");

        if (config.events.length <= 0) {
            embed.addField("Notice", "There are no upcoming events!");
            await interaction.reply({ embeds: [ embed ] });
            return;
        }

        const index = interaction.options.getInteger("index");
        if (index !== null) {
            const event: EventObj = config.events[index % config.events.length];
            embed.setTitle(event.name);
            embed.setDescription(event.description);

            for (const [ key, value ] of event.additional) {
                embed.addField(key, value, false);
            }

            embed.addField("Time Remaining:", `<t:${event.dateTime}:R>`, false);
            embed.addField("Set For:", `<t:${event.dateTime}:f>`, false);
        } else {
            embed.setTitle("Upcoming Events");

            for (const [ index, event ] of config.events.entries()) {
                embed.addField(`Index ${index}:`, `${event.name}\n**Begins: <t:${event.dateTime}:R>**`, false);
            }
        }
        await interaction.reply({ embeds: [ embed ] });
    }

    public async onReady(client: Client) {
        const configs: EventManagerConfig[] = await this.eventManagerRepository.find({});

        for (const config of configs) {
            if (!config.listenerChannelId || !config.events.length) continue;
            await fetchMessages(client, config.guildId, config.listenerChannelId, config.events.map(event => event.messageId));
        }
    }

    private async findOneOrCreate(id: string): Promise<EventManagerConfig> {
        let result = await this.eventManagerRepository.findOne({ guildId: id });
        if (result) return result;

        result = new EventManagerConfig();
        result.guildId = id;

        return await this.eventManagerRepository.save(result);
    }
}
