"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var EventManagerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManagerModule = void 0;
const eventManager_1 = require("../models/eventManager");
const dayjs_1 = __importDefault(require("dayjs"));
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const moduleBase_1 = require("../classes/moduleBase");
const task_1 = require("../classes/task");
const eventManagerConfigService_1 = require("../services/eventManagerConfigService");
const typedi_1 = require("typedi");
let EventManagerModule = EventManagerModule_1 = class EventManagerModule extends moduleBase_1.ModuleBase {
    constructor(service) {
        super();
        this.service = service;
        this._moduleName = "EventManager";
        this._commands = [
            {
                command: builder => builder
                    .setName("event")
                    .setDescription("Displays events.")
                    .addIntegerOption(option => option.setName("index").setDescription("The index for the event, starting at 0")),
                run: async (interaction) => await this.event(interaction)
            }
        ];
        this._listeners = [
            { event: "messageCreate", run: this.createEvent },
            {
                event: "messageUpdate", run: async (_, oldMessage, newMessage) => {
                    if (oldMessage.partial)
                        await oldMessage.fetch();
                    if (newMessage.partial)
                        await newMessage.fetch();
                    await this.updateEvent(oldMessage, newMessage);
                }
            },
            {
                event: "messageDelete", run: async (_, message) => {
                    if (message.partial)
                        await message.fetch();
                    await this.deleteEvent(message);
                }
            },
            {
                event: "ready", run: async (client) => {
                    const configs = await this.service.getAll();
                    for (const config of configs) {
                        if (!config.listenerChannelId || !config.events.length)
                            continue;
                        await (0, utils_1.fetchMessages)(client, config.guildId, config.listenerChannelId, config.events.map(event => event.messageId));
                    }
                }
            },
        ];
        this._tasks = [
            {
                name: "eventManager_postMessageLoop", timeout: 60000, run: async (client) => {
                    await task_1.Task.waitTillReady(client);
                    await this.reminderLoop(client);
                }
            }
        ];
    }
    parseMessage(messageId, content, config) {
        const event = new eventManager_1.EventObj(messageId);
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
    async getConfig(guildId) {
        if (guildId == null || !guildId.trim())
            throw new ReferenceError("guildId cannot be null nor empty.");
        return this.service.findOneOrCreate(guildId);
    }
    async createEvent(_, message) {
        if (message.author.id === message.client.application?.id)
            return;
        if (!message.guildId)
            return;
        const config = await this.getConfig(message.guildId);
        if (config.listenerChannelId !== message.channelId)
            return;
        const [l, r] = config.delimiterCharacters;
        const matchTags = (message.content?.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g")) ?? []).map(l => l.trim());
        if (!matchTags.includes(config.tags.announcement))
            return;
        const event = this.parseMessage(message.id, message.content, config);
        try {
            if (event.isValid) {
                config.events.push(event);
                await message.react("✅");
                await this.service.update(config);
            }
            else {
                await message.react("❎");
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    async updateEvent(oldMessage, newMessage) {
        if (!oldMessage.guildId)
            return;
        const config = await this.getConfig(oldMessage.guildId);
        if (config.listenerChannelId !== oldMessage.channelId)
            return;
        const oldEvent = config.events.find(event => event.messageId === oldMessage.id);
        if (!oldEvent)
            return;
        const newEvent = this.parseMessage(oldMessage.id, newMessage.content, config);
        try {
            const reaction = newMessage.reactions.cache.find(reaction => reaction.me);
            if (reaction)
                await reaction.users.remove(oldMessage.client.user?.id);
            if (newEvent.isValid) {
                await newMessage.react("✅");
                config.events[config.events.indexOf(oldEvent)] = newEvent;
                await this.service.update(config);
            }
            else {
                await newMessage.react("❎");
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async deleteEvent(message) {
        if (!message.guildId)
            return;
        const config = await this.getConfig(message.guildId);
        if (!config.events.find(event => event.messageId === message.id))
            return;
        config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
        await this.service.update(config);
    }
    static parseTriggerDuration(triggerTime) {
        const hold = (0, dayjs_1.default)(triggerTime, "HH:mm", true);
        return dayjs_1.default.duration({ hours: hold.hour(), minutes: hold.minute() });
    }
    async reminderLoop(client) {
        const now = (0, dayjs_1.default)();
        const configs = await this.service.getAll();
        const alteredConfigs = [];
        for (const config of configs) {
            try {
                if (!client.guilds.cache.has(config.guildId))
                    continue;
                let postingGuild = await client.guilds.fetch(config.guildId);
                if (!postingGuild)
                    continue;
                if (config.events.length > 0 && config.postingChannelId) {
                    const postingChannel = await postingGuild.channels.fetch(config.postingChannelId);
                    if (!postingChannel)
                        continue;
                    for (const trigger of config.reminders) {
                        if (!trigger.timeDelta)
                            continue;
                        const triggerTime = EventManagerModule_1.parseTriggerDuration(trigger.timeDelta);
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
        if (alteredConfigs.length > 0) {
            await this.service.bulkUpdate(alteredConfigs);
        }
    }
    async event(interaction) {
        const config = await this.getConfig(interaction.guildId);
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
};
EventManagerModule = EventManagerModule_1 = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [eventManagerConfigService_1.EventManagerConfigService])
], EventManagerModule);
exports.EventManagerModule = EventManagerModule;
