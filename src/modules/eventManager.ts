import {EventManagerConfig, EventObj, Tags} from "../objects/EventManager";
import Model from "../models/EventManager";
import dayjs from "dayjs";
import {CommandInteraction, Message, MessageEmbed, TextChannel} from "discord.js";
import Client from "../classes/Client";
import {Module} from "../classes/Module";
import Command from "../classes/Command";
import {SlashCommandBuilder} from "@discordjs/builders";
import Listener from "../classes/Listener";
import {fetchMessages} from "../utils";
import Task from "../classes/Task";

function splitChunk(array: string[]): [string, string][] {
    const r: [string, string][] = [];

    for (let i = 0; i < array.length; i += 2) {
        let temp = array.slice(i, i + 2);
        r.push([temp[0], temp[1]]);
    }

    return r;
}


function parseMessage(messageId: string, content: string, config: EventManagerConfig): EventObj {
    const event = new EventObj(messageId);
    const hammerRegex: RegExp = /:(.*?):/
    const [l, r] = config.delimiterCharacters as [string, string];
    const re: RegExp = new RegExp(`${l}(.*?)${r}`);

    const patternSplit: string[] = content.split(re).map(l => l.replace("\n", "").trim()).filter(l => l);

    for (const [key, value] of splitChunk(patternSplit)) {
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
                const matchedResult = value.match(hammerRegex);

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

async function getConfig(guildId: string) {
    if (guildId == null || !guildId.trim()) throw new ReferenceError("guildId cannot be null nor empty.");

    return await Model.findOne({_id: guildId}) ?? await Model.create({_id: guildId});
}

async function createEvent(message: Message) {
    if (message.author.id === message.client.application?.id) return;
    if (!message.guildId) return;
    const config = await getConfig(message.guildId);

    if (!config.listenerChannelId || message.channelId !== config.listenerChannelId) return;
    const [l, r]: string[] = config.delimiterCharacters as string[];
    const matchTags: string[] = (message.content.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g")) ?? []).map(l => l.trim());

    if (!matchTags.includes((config.tags as Tags).announcement)) return;

    const event: EventObj = parseMessage(message.id, message.content, config);
    try {
        if (event.isValid) {
            config.events.push(event);
            await message.react("✅");
            config.save().catch(err => console.log(err));
        } else {
            await message.react("❎");
        }
    } catch (e) {
        console.error(e);
    }
}

async function updateEvent(oldMessage: Message, newMessage: Message) {
    if (newMessage.author?.id === newMessage.client.application?.id) return;
    if (!oldMessage.guildId) return;

    const config = await getConfig(oldMessage.guildId);

    if (!config.listenerChannelId || oldMessage.channelId !== config.listenerChannelId) return;
    const oldEvent = config.events.find(event => event.messageId === oldMessage.id);
    if (!oldEvent) return;

    const newEvent = parseMessage(newMessage.id, newMessage.content, config);

    try {
        const reaction = newMessage.reactions.cache.find(reaction => reaction.me);
        if (reaction)
            await reaction.users.remove(oldMessage.client.user?.id);

        if (newEvent.isValid) {
            await newMessage.react("✅");
            config.events[config.events.indexOf(oldEvent)] = newEvent;
            await config.save();
        } else {
            await newMessage.react("❎");
        }
    } catch (error) {
        console.error(error);
    }
}

async function deleteEvent(message: Message) {
    if (message.author?.id === message.client.application?.id) return;
    if (!message.guildId) return;
    const config = await getConfig(message.guildId);

    if (!config.listenerChannelId || message.channelId !== config.listenerChannelId) return;
    if (!config.events.find(event => event.messageId === message.id)) return;

    config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
    await config.save();
}


function parseTriggerDuration(triggerTime: string) {
    const hold = dayjs(triggerTime, "HH:mm", true);
    return dayjs.duration({hours: hold.hour(), minutes: hold.minute()});
}

async function postEventRemindersLoop(client: Client) {
    const now: dayjs.Dayjs = dayjs();
    const configs = await Model.find({});
    const alteredConfigs = [];

    for (const config of configs) {
        try {
            if (!client.guilds.cache.has(config._id)) continue;
            if (config.events.length > 0 && config.postingChannelId) {
                const postingChannel: TextChannel | null = await client.channels.fetch(config.postingChannelId) as TextChannel | null;
                if (!postingChannel) continue;

                for (const trigger of config.reminders) {
                    if (!trigger.timeDelta) continue;
                    const triggerTime = parseTriggerDuration(trigger.timeDelta);
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

    Model.bulkSave(alteredConfigs).catch(err => console.error(err));
}

async function event(interaction: CommandInteraction) {
    const config = await getConfig(interaction.guildId);


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
        embed.addField("Time remaining:", `<t:${time}:R>`, false);
        embed.addField("Set For:", `<t:${time}:f>`, false);
    } else {
        embed.setTitle("Upcoming Events");

        for (const [index, event] of config.events.entries()) {
            embed.addField(`Index ${index}:`, `${event.name}\n**Begins: <t:${dayjs(event.dateTime).unix()}:R>**`, false);
        }
    }
    await interaction.reply({embeds: [embed]});
}

class EventManager extends Module {

    constructor() {
        super("EventManager");

        this.commands = [
            new Command(new SlashCommandBuilder()
                    .setName("event")
                    .setDescription("Displays events.")
                    .addIntegerOption(option => option.setName("index").setDescription("The index for the event, starting at 0")),
                async interaction => await event(interaction))
        ];

        this.listeners = [
            new Listener(`${this.name}#OnMessageCreate`, "messageCreate", messageCreateListener),
            new Listener(`${this.name}#OnMessageUpdate`, "messageUpdate", async (oldMessage, newMessage) => {
                if (oldMessage.partial) await oldMessage.fetch();
                if (newMessage.partial) await newMessage.fetch();
                await messageUpdateListener(oldMessage as Message, newMessage as Message);
            }),
            new Listener(`${this.name}#OnMessageDelete`, "messageDelete", async (message) => {
                if (message.partial) await message.fetch();
                await messageDeleteListener(message as Message);
            }),
            new Listener(`${this.name}#OnReady`, "ready", async (client) => {
                const configs: EventManagerConfig[] = await Model.find({});

                for (const config of configs) {
                    if (!config.listenerChannelId || !config.events.length) continue;
                    await fetchMessages(client, config._id, config.listenerChannelId, config.events.map(event => event.messageId));
                }
            })
        ];

        this.tasks = [
            new Task("eventManager_postMessageLoop", 60000, async client => {
                await Task.waitTillReady(client);
                await postEventRemindersLoop(client);
            })
        ];
    }

}

export default new EventManager();
