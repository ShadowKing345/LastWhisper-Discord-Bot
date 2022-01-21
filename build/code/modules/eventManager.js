"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTriggerDuration = exports.reminderLoop = exports.event = exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getConfig = exports.parseMessage = void 0;
const EventManager_1 = require("../objects/EventManager");
const EventManager_2 = __importDefault(require("../schema/EventManager"));
const dayjs_1 = __importDefault(require("dayjs"));
const discord_js_1 = require("discord.js");
const Module_1 = require("../classes/Module");
const Command_1 = __importDefault(require("../classes/Command"));
const builders_1 = require("@discordjs/builders");
const Listener_1 = __importDefault(require("../classes/Listener"));
const utils_1 = require("../utils");
const Task_1 = __importDefault(require("../classes/Task"));
function parseMessage(messageId, content, config) {
    const event = new EventManager_1.EventObj(messageId);
    const hammerRegex = /<.*:(\d+):.*>/;
    const [l, r] = config.delimiterCharacters;
    const re = new RegExp(`${l}(.*)${r}([^${l}]*)`, "gm");
    const patternSplit = (content?.match(re) ?? []).map(l => {
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
                let date;
                if (config.dateTimeFormat.length > 0) {
                    date = (0, dayjs_1.default)(value, config.dateTimeFormat, true);
                    if (date.isValid()) {
                        event.dateTime = date.toDate();
                        break;
                    }
                }
                // Checks if it's hammer time.
                const matchedResult = value?.match(hammerRegex);
                if (!matchedResult)
                    break;
                const unixTimeStr = matchedResult[1];
                if (!unixTimeStr)
                    break;
                const number = Number(unixTimeStr);
                if (isNaN(number))
                    break;
                date = dayjs_1.default.unix(number);
                if (!date.isValid())
                    break;
                event.dateTime = date.toDate();
                break;
            default:
                if (!config.tags.exclusionList.every(e => e !== key))
                    continue;
                event.additional.push([key, value]);
                break;
        }
    }
    return event;
}
exports.parseMessage = parseMessage;
async function getConfig(guildId) {
    if (guildId == null || !guildId.trim())
        throw new ReferenceError("guildId cannot be null nor empty.");
    return await EventManager_2.default.findOne({ _id: guildId }) ?? await EventManager_2.default.create({ _id: guildId });
}
exports.getConfig = getConfig;
async function createEvent(message) {
    if (message.author.id === message.client.application?.id)
        return;
    if (!message.guildId)
        return;
    const config = await getConfig(message.guildId);
    if (config.listenerChannelId !== message.channelId)
        return;
    const [l, r] = config.delimiterCharacters;
    const matchTags = (message.content?.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g")) ?? []).map(l => l.trim());
    if (!matchTags.includes(config.tags.announcement))
        return;
    const event = parseMessage(message.id, message.content, config);
    try {
        if (event.isValid) {
            config.events.push(event);
            await message.react("✅");
            config.save().catch(err => console.error(err));
        }
        else {
            await message.react("❎");
        }
    }
    catch (e) {
        console.error(e);
    }
}
exports.createEvent = createEvent;
async function updateEvent(oldMessage, newMessage) {
    if (!oldMessage.guildId)
        return;
    const config = await getConfig(oldMessage.guildId);
    if (config.listenerChannelId !== oldMessage.channelId)
        return;
    const oldEvent = config.events.find(event => event.messageId === oldMessage.id);
    if (!oldEvent)
        return;
    const newEvent = parseMessage(oldMessage.id, newMessage.content, config);
    try {
        const reaction = newMessage.reactions.cache.find(reaction => reaction.me);
        if (reaction)
            await reaction.users.remove(oldMessage.client.user?.id);
        if (newEvent.isValid) {
            await newMessage.react("✅");
            config.events[config.events.indexOf(oldEvent)] = newEvent;
            await config.save();
        }
        else {
            await newMessage.react("❎");
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.updateEvent = updateEvent;
async function deleteEvent(message) {
    if (!message.guildId)
        return;
    const config = await getConfig(message.guildId);
    if (!config.events.find(event => event.messageId === message.id))
        return;
    config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
    await config.save();
}
exports.deleteEvent = deleteEvent;
function parseTriggerDuration(triggerTime) {
    const hold = (0, dayjs_1.default)(triggerTime, "HH:mm", true);
    return dayjs_1.default.duration({ hours: hold.hour(), minutes: hold.minute() });
}
exports.parseTriggerDuration = parseTriggerDuration;
async function reminderLoop(client) {
    const now = (0, dayjs_1.default)();
    const configs = await EventManager_2.default.find({});
    const alteredConfigs = [];
    for (const config of configs) {
        try {
            if (!client.guilds.cache.has(config._id))
                continue;
            let postingGuild = await client.guilds.fetch(config._id);
            if (!postingGuild)
                continue;
            if (config.events.length > 0 && config.postingChannelId) {
                const postingChannel = await postingGuild.channels.fetch(config.postingChannelId);
                if (!postingChannel)
                    continue;
                for (const trigger of config.reminders) {
                    if (!trigger.timeDelta)
                        continue;
                    const triggerTime = parseTriggerDuration(trigger.timeDelta);
                    for (const event of config.events) {
                        const eventTime = (0, dayjs_1.default)(event.dateTime);
                        if (!now.isSame(eventTime, "date"))
                            continue;
                        if (eventTime.diff(now, "minutes") === triggerTime.asMinutes()) {
                            const messageValues = {
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
            for (const past of config.events.filter(event => now.isAfter((0, dayjs_1.default)(event.dateTime))))
                config.events.splice(config.events.indexOf(past), 1);
            if (before !== config.events.length)
                alteredConfigs.push(config);
        }
        catch (err) {
            console.error(err);
        }
    }
    if (alteredConfigs.length > 0)
        EventManager_2.default.bulkSave(alteredConfigs).catch(err => console.error(err));
}
exports.reminderLoop = reminderLoop;
async function event(interaction) {
    const config = await getConfig(interaction.guildId);
    const embed = new discord_js_1.MessageEmbed().setColor("RANDOM");
    if (config.events.length <= 0) {
        embed.addField("Notice", "There are no upcoming events!");
        await interaction.reply({ embeds: [embed] });
        return;
    }
    const index = interaction.options.getInteger("index");
    if (index !== null) {
        const event = config.events[index % config.events.length];
        embed.setTitle(event.name);
        embed.setDescription(event.description);
        for (const [key, value] of event.additional) {
            embed.addField(key, value, false);
        }
        const time = (0, dayjs_1.default)(event.dateTime).unix();
        embed.addField("Time Remaining:", `<t:${time}:R>`, false);
        embed.addField("Set For:", `<t:${time}:f>`, false);
    }
    else {
        embed.setTitle("Upcoming Events");
        for (const [index, event] of config.events.entries()) {
            embed.addField(`Index ${index}:`, `${event.name}\n**Begins: <t:${(0, dayjs_1.default)(event.dateTime).unix()}:R>**`, false);
        }
    }
    await interaction.reply({ embeds: [embed] });
}
exports.event = event;
class EventManager extends Module_1.Module {
    constructor() {
        super("EventManager");
        this.commands = [
            new Command_1.default(new builders_1.SlashCommandBuilder()
                .setName("event")
                .setDescription("Displays events.")
                .addIntegerOption(option => option.setName("index").setDescription("The index for the event, starting at 0")), async (interaction) => await event(interaction))
        ];
        this.listeners = [
            new Listener_1.default(`${this.name}#OnMessageCreate`, "messageCreate", createEvent),
            new Listener_1.default(`${this.name}#OnMessageUpdate`, "messageUpdate", async (oldMessage, newMessage) => {
                if (oldMessage.partial)
                    await oldMessage.fetch();
                if (newMessage.partial)
                    await newMessage.fetch();
                await updateEvent(oldMessage, newMessage);
            }),
            new Listener_1.default(`${this.name}#OnMessageDelete`, "messageDelete", async (message) => {
                if (message.partial)
                    await message.fetch();
                await deleteEvent(message);
            }),
            new Listener_1.default(`${this.name}#OnReady`, "ready", async (client) => {
                const configs = await EventManager_2.default.find({});
                for (const config of configs) {
                    if (!config.listenerChannelId || !config.events.length)
                        continue;
                    await (0, utils_1.fetchMessages)(client, config._id, config.listenerChannelId, config.events.map(event => event.messageId));
                }
            })
        ];
        this.tasks = [
            new Task_1.default("eventManager_postMessageLoop", 60000, async (client) => {
                await Task_1.default.waitTillReady(client);
                await reminderLoop(client);
            })
        ];
    }
}
exports.default = new EventManager();
