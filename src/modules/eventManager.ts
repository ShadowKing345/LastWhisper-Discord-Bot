import Model, {EventManagerConfig, EventObj, Tags} from "../objects/EventManager";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import AdvancedFormat from "dayjs/plugin/advancedFormat";
import Duration from "dayjs/plugin/duration";
import {CommandInteraction, Message, MessageEmbed, TextChannel} from "discord.js";
import Client from "../classes/Client";
import {Module} from "../classes/Module";
import Command from "../classes/Command";
import {SlashCommandBuilder} from "@discordjs/builders";
import Listener from "../classes/Listener";
import {fetchMessages} from "../utils";
import Task from "../classes/Task";

dayjs.extend(CustomParseFormat);
dayjs.extend(AdvancedFormat);
dayjs.extend(Duration);


function getDict(array: string[], tags: string[]) {
    const r: { [key: string]: string } = {};
    tags.forEach(t => {
        const keyIndex = array.indexOf(t);
        if (keyIndex + 1 >= array.length) return;
        r[array[keyIndex]] = array[keyIndex + 1];
    });
    return r;
}


function parseMessage(messageId: string, content: string, matchTags: string[], re: RegExp, tags: Tags, dateTimeFormat: string[]): EventObj {
    const event = new EventObj(messageId);
    const hammerRegex: RegExp = /:(.*?):/

    const patternSplit: string[] = content.split(re).map(l => l.replace("\n", "").trim());
    const splitContent: { [key: string]: string } = getDict(patternSplit, matchTags);

    for (const [key, content] of Object.entries(splitContent)) {
        switch (key) {
            case tags.announcement:
                event.name = content;
                break;

            case tags.description:
                event.description = content;
                break;

            case tags.dateTime:
                let date: dayjs.Dayjs;
                if (dateTimeFormat.length > 0) {
                    date = dayjs(content, dateTimeFormat, true);
                    if (date.isValid()) {
                        event.dateTime = date.format();
                        break;
                    }
                }

                // Checks if it's hammer time.
                const matchedResult = content.match(hammerRegex);

                if (!matchedResult) break;
                const unixTimeStr = matchedResult[1];
                if (!unixTimeStr) break;
                const number: number = Number(unixTimeStr);
                if (isNaN(number)) break;

                date = dayjs.unix(number);
                if (!date.isValid()) break;
                event.dateTime = date.format();
                break;

            default:
                if (!tags.exclusionList.every(e => e !== key)) continue;
                event.additional[key] = content;
                break;
        }
    }

    return event;
}

async function getConfig(guildId: string) {
    return await Model.findOne({_id: guildId}) ?? await Model.create({_id: guildId});
}

async function messageCreateListener(message: Message) {
    if (message.author.id === message.client.application?.id) return;
    if (!message.guildId) return;
    const config = await getConfig(message.guildId);

    if (!config.listenerChannelId || message.channelId !== config.listenerChannelId) return;
    const [l, r]: string[] = config.delimiterCharacters as string[];
    const matchTags: string[] = (message.content.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g")) ?? []).map(l => l.trim());

    if (!matchTags.includes((config.tags as Tags).announcement)) return;

    const re: RegExp = new RegExp(`${l}(.*?)${r}`);

    const event: EventObj = parseMessage(message.id, message.content, matchTags, re, config.tags as Tags, config.dateTimeFormat as []);
    try {
        if (event.isValid()) {
            config.events.push(event);
            await message.react("✅");
            config.save().catch(err => console.log(err));
        } else {
            await message.react("❎");
        }
    } catch (error) {
        console.error(error);
    }
}

async function messageUpdateListener(oldMessage: Message, newMessage: Message) {
    if (newMessage.author?.id === newMessage.client.application?.id) return;
    if (!oldMessage.guildId) return;
    const config = await getConfig(oldMessage.guildId);

    if (!config.listenerChannelId || oldMessage.channelId !== config.listenerChannelId) return;
    const oldEvent = config.events.find(event => event.messageId === oldMessage.id);
    if (!oldEvent) return;

    const [l, r] = config.delimiterCharacters as [string, string];
    const matchTags: string[] = newMessage.content.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g"))?.map(l => l.trim());
    const re: RegExp = new RegExp(`${l}(.*?)${r}`);

    const newEvent = parseMessage(newMessage.id, newMessage.content, matchTags, re, config.tags as Tags, config.dateTimeFormat as string[]);

    try {
        const reaction = newMessage.reactions.cache.find(reaction => reaction.me);
        if (reaction)
            await reaction.users.remove(oldMessage.client.user?.id);

        if (newEvent.isValid()) {
            oldEvent.name = newEvent.name;
            oldEvent.description = newEvent.description;
            oldEvent.dateTime = newEvent.dateTime;
            oldEvent.additional = newEvent.additional;
            await newMessage.react("✅");
            config.save().catch(err => console.log(err));
        } else {
            await newMessage.react("❎");
        }
    } catch (error) {
        console.error(error);
    }
}

async function messageDeleteListener(message: Message) {
    if (message.author?.id === message.client.application?.id) return;
    if (!message.guildId) return;
    const config = await getConfig(message.guildId);

    if (!config.listenerChannelId || message.channelId !== config.listenerChannelId) return;
    if (!config.events.find(event => event.messageId === message.id)) return;

    config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
    config.save().catch(err => console.error(err));
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

    const index = interaction.options.getInteger("index");
    if (index !== null) {
        const event: EventObj = config.events[index % config.events.length];
        embed.setTitle(event.name);
        embed.setDescription(event.description);

        for (const [key, value] of Object.entries(event.additional)) {
            embed.addField(key, value, false);
        }

        const time: number = dayjs(event.dateTime).unix();
        embed.addField("Time remaining:", `<t:${time}:R>`, false);
        embed.addField("Set For:", `<t:${time}:f>`, false);
    } else {
        embed.setTitle("Upcoming Events");

        if (config.events.length > 0) {
            for (const [index, event] of config.events.entries()) {
                embed.addField(`Index ${index}:`, `${event.name}\n**Begins: <t:${dayjs(event.dateTime).unix()}:R>**`, false);
            }
        } else {
            embed.addField("Notice", "There are no upcoming events!");
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
