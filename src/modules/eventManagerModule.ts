import {EventManagerConfig, EventObj, Tags} from "../models/eventManager";
import dayjs from "dayjs";
import {Client, CommandInteraction, Guild, Message, MessageEmbed, TextChannel} from "discord.js";
import {fetchMessages} from "../utils";
import {ModuleBase} from "../classes/moduleBase";
import {Task} from "../classes/task";
import {EventManagerConfigService} from "../services/eventManagerConfigService";
import {Service} from "typedi";

@Service()
export class EventManagerModule extends ModuleBase {

    constructor(private service: EventManagerConfigService) {
        super();

        this._moduleName = "EventManager";
        this._commands = [
            {
                command: builder => builder
                    .setName("event")
                    .setDescription("Displays events.")
                    .addIntegerOption(option => option.setName("index").setDescription("The index for the event, starting at 0")),
                run: async interaction => await this.event(interaction)
            }
        ];

        this._listeners = [
            {event: "messageCreate", run: this.createEvent},
            {
                event: "messageUpdate", run: async (_, oldMessage: Message, newMessage: Message) => {
                    if (oldMessage.partial) await oldMessage.fetch();
                    if (newMessage.partial) await newMessage.fetch();
                    await this.updateEvent(oldMessage, newMessage);
                }
            },
            {
                event: "messageDelete", run: async (_, message: Message) => {
                    if (message.partial) await message.fetch();
                    await this.deleteEvent(message);
                }
            },
            {
                event: "ready", run: async (client) => {
                    const configs: EventManagerConfig[] = await this.service.getAll();

                    for (const config of configs) {
                        if (!config.listenerChannelId || !config.events.length) continue;
                        await fetchMessages(client, config.guildId, config.listenerChannelId, config.events.map(event => event.messageId));
                    }
                }
            },
        ];

        this._tasks = [
            {
                name: "eventManager_postMessageLoop", timeout: 60000, run: async client => {
                    await Task.waitTillReady(client);
                    await this.reminderLoop(client);
                }
            }
        ];
    }


    private parseMessage(messageId: string, content: string, config: EventManagerConfig): EventObj {
        const event = new EventObj(messageId);
        const hammerRegex: RegExp = /<.*:(\d+):.*>/
        const [l, r] = config.delimiterCharacters as [string, string];
        const re: RegExp = new RegExp(`${l}(.*)${r}([^${l}]*)`, "gm");

        const patternSplit: [string | null, string | null][] = (content?.match(re) ?? []).map(l => {
            re.lastIndex = 0;
            let match = re.exec(l).slice(1, 3) ?? [null, null];
            return [match[0]?.trim(), match[1]?.trim()];
        });

        for (const [key, value] of patternSplit) {
            switch (key) {
                case config.tags.announcement:
                    event.name = value;
                    break;

                case config.tags.description:
                    event.description = value;
                    break;

                case config.tags.dateTime:
                    let date: dayjs.Dayjs;
                    if (config.dateTimeFormat.length > 0) {
                        date = dayjs(value, config.dateTimeFormat, true);
                        if (date.isValid()) {
                            event.dateTime = date.toDate();
                            break;
                        }
                    }

                    // Checks if it's hammer time.
                    const matchedResult = value?.match(hammerRegex);

                    if (!matchedResult) break;
                    const unixTimeStr = matchedResult[1];
                    if (!unixTimeStr) break;
                    const number: number = Number(unixTimeStr);
                    if (isNaN(number)) break;

                    date = dayjs.unix(number);
                    if (!date.isValid()) break;
                    event.dateTime = date.toDate();
                    break;

                default:
                    if (!config.tags.exclusionList.every(e => e !== key)) continue;
                    event.additional.push([key, value]);
                    break;
            }
        }

        return event;
    }

    private async getConfig(guildId: string) {
        if (guildId == null || !guildId.trim()) throw new ReferenceError("guildId cannot be null nor empty.");

        return this.service.findOneOrCreate(guildId);
    }

    private async createEvent(_, message: Message) {
        if (message.author.id === message.client.application?.id) return;
        if (!message.guildId) return;
        const config = await this.getConfig(message.guildId);

        if (config.listenerChannelId !== message.channelId) return;
        const [l, r]: string[] = config.delimiterCharacters as string[];

        const matchTags: string[] = (message.content?.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g")) ?? []).map(l => l.trim());
        if (!matchTags.includes((config.tags as Tags).announcement)) return;

        const event: EventObj = this.parseMessage(message.id, message.content, config);
        try {
            if (event.isValid) {
                config.events.push(event);
                await message.react("✅");
                await this.service.update(config);
            } else {
                await message.react("❎");
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async updateEvent(oldMessage: Message, newMessage: Message) {
        if (!oldMessage.guildId) return;

        const config = await this.getConfig(oldMessage.guildId);

        if (config.listenerChannelId !== oldMessage.channelId) return;
        const oldEvent = config.events.find(event => event.messageId === oldMessage.id);
        if (!oldEvent) return;

        const newEvent = this.parseMessage(oldMessage.id, newMessage.content, config);

        try {
            const reaction = newMessage.reactions.cache.find(reaction => reaction.me);
            if (reaction)
                await reaction.users.remove(oldMessage.client.user?.id);

            if (newEvent.isValid) {
                await newMessage.react("✅");
                config.events[config.events.indexOf(oldEvent)] = newEvent;
                await this.service.update(config);
            } else {
                await newMessage.react("❎");
            }
        } catch (error) {
            console.error(error);
        }
    }

    private async deleteEvent(message: Message) {
        if (!message.guildId) return;
        const config = await this.getConfig(message.guildId);

        if (!config.events.find(event => event.messageId === message.id)) return;

        config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
        await this.service.update(config);
    }


    private static parseTriggerDuration(triggerTime: string) {
        const hold = dayjs(triggerTime, "HH:mm", true);
        return dayjs.duration({hours: hold.hour(), minutes: hold.minute()});
    }

    private async reminderLoop(client: Client) {
        const now: dayjs.Dayjs = dayjs();
        const configs = await this.service.getAll();
        const alteredConfigs = [];

        for (const config of configs) {
            try {
                if (!client.guilds.cache.has(config.guildId)) continue;
                let postingGuild: Guild = await client.guilds.fetch(config.guildId);
                if (!postingGuild) continue;
                if (config.events.length > 0 && config.postingChannelId) {
                    const postingChannel: TextChannel | null = await postingGuild.channels.fetch(config.postingChannelId) as TextChannel | null;
                    if (!postingChannel) continue;

                    for (const trigger of config.reminders) {
                        if (!trigger.timeDelta) continue;
                        const triggerTime = EventManagerModule.parseTriggerDuration(trigger.timeDelta);
                        for (const event of config.events) {
                            const eventTime = dayjs(event.dateTime);
                            if (!now.isSame(eventTime, "date")) continue;
                            if (eventTime.diff(now, "minutes") === triggerTime.asMinutes()) {
                                const messageValues: { [key: string]: string } = {
                                    "%everyone%": "@everyone",
                                    "%eventName%": event.name,
                                    "%hourDiff%": triggerTime.hours().toString(),
                                    "%minuteDiff%": triggerTime.minutes().toString()
                                };

                                await postingChannel.send(trigger.message.replace(/%\w+%/g, (v) => messageValues[v] || v));
                            }
                        }
                    }
                }

                const before = config.events.length;

                for (const past of config.events.filter(event => now.isAfter(dayjs(event.dateTime))))
                    config.events.splice(config.events.indexOf(past), 1);


                if (before !== config.events.length)
                    alteredConfigs.push(config);
            } catch (err) {
                console.error(err);
            }
        }

        if (alteredConfigs.length > 0) {
            await this.service.bulkUpdate(alteredConfigs);
        }
    }

    private async event(interaction: CommandInteraction) {
        const config = await this.getConfig(interaction.guildId);

        const embed: MessageEmbed = new MessageEmbed().setColor("RANDOM");

        if (config.events.length <= 0) {
            embed.addField("Notice", "There are no upcoming events!");
            await interaction.reply({embeds: [embed]});
            return;
        }

        const index = interaction.options.getInteger("index");
        if (index !== null) {
            const event: EventObj = config.events[index % config.events.length];
            embed.setTitle(event.name);
            embed.setDescription(event.description);

            for (const [key, value] of event.additional) {
                embed.addField(key, value, false);
            }

            const time: number = dayjs(event.dateTime).unix();
            embed.addField("Time Remaining:", `<t:${time}:R>`, false);
            embed.addField("Set For:", `<t:${time}:f>`, false);
        } else {
            embed.setTitle("Upcoming Events");

            for (const [index, event] of config.events.entries()) {
                embed.addField(`Index ${index}:`, `${event.name}\n**Begins: <t:${dayjs(event.dateTime).unix()}:R>**`, false);
            }
        }
        await interaction.reply({embeds: [embed]});
    }
}