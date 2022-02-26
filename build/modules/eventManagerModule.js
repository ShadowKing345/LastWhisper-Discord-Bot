var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventObj } from "../models/eventManager.model.js";
import dayjs from "dayjs";
import { MessageEmbed } from "discord.js";
import { fetchMessages } from "../utils/utils.js";
import { ModuleBase } from "../classes/moduleBase.js";
import { Task } from "../classes/task.js";
import { EventManagerConfigService } from "../services/eventManagerConfigService.js";
export class EventManagerModule extends ModuleBase {
    constructor() {
        super();
        this.service = new EventManagerConfigService();
        this._moduleName = "EventManager";
        this._commands = [
            {
                command: builder => builder
                    .setName("event")
                    .setDescription("Displays events.")
                    .addIntegerOption(option => option.setName("index").setDescription("The index for the event, starting at 0")),
                run: (interaction) => __awaiter(this, void 0, void 0, function* () { return this.event(interaction); })
            }
        ];
        this._listeners = [
            { event: "messageCreate", run: (_, message) => __awaiter(this, void 0, void 0, function* () { return this.createEvent(message); }) },
            { event: "messageUpdate", run: (_, old, message) => __awaiter(this, void 0, void 0, function* () { return this.updateEvent(old, message); }) },
            { event: "messageDelete", run: (_, message) => __awaiter(this, void 0, void 0, function* () { return yield this.deleteEvent(message); }) },
            { event: "ready", run: (client) => __awaiter(this, void 0, void 0, function* () { return this.onReady(client); }) },
        ];
        this._tasks = [
            {
                name: `${this.moduleName}#postMessageTask`,
                timeout: 60000,
                run: (client) => __awaiter(this, void 0, void 0, function* () { return yield this.reminderLoop(client); })
            }
        ];
    }
    parseMessage(messageId, content, config) {
        var _a;
        const event = new EventObj(messageId);
        const hammerRegex = /<.*:(\d+):.*>/;
        const [l, r] = config.delimiterCharacters;
        const re = new RegExp(`${l}(.*)${r}([^${l}]*)`, "gm");
        const patternSplit = ((_a = content === null || content === void 0 ? void 0 : content.match(re)) !== null && _a !== void 0 ? _a : []).map(l => {
            var _a, _b, _c;
            re.lastIndex = 0;
            const match = (_a = re.exec(l).slice(1, 3)) !== null && _a !== void 0 ? _a : [null, null];
            return [(_b = match[0]) === null || _b === void 0 ? void 0 : _b.trim(), (_c = match[1]) === null || _c === void 0 ? void 0 : _c.trim()];
        });
        for (const [key, value] of patternSplit) {
            let date, matchedResult, unixTimeStr, number;
            switch (key) {
                case config.tags.announcement:
                    event.name = value;
                    break;
                case config.tags.description:
                    event.description = value;
                    break;
                case config.tags.dateTime:
                    if (config.dateTimeFormat.length > 0) {
                        date = dayjs(value, config.dateTimeFormat, true);
                        if (date.isValid()) {
                            event.dateTime = date.toDate();
                            break;
                        }
                    }
                    // Checks if it's hammer time.
                    matchedResult = value === null || value === void 0 ? void 0 : value.match(hammerRegex);
                    if (!matchedResult)
                        break;
                    unixTimeStr = matchedResult[1];
                    if (!unixTimeStr)
                        break;
                    number = Number(unixTimeStr);
                    if (isNaN(number))
                        break;
                    date = dayjs.unix(number);
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
    getConfig(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (guildId == null || !guildId.trim())
                throw new ReferenceError("guildId cannot be null nor empty.");
            return this.service.findOneOrCreate(guildId);
        });
    }
    createEvent(message) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.id === ((_a = message.client.application) === null || _a === void 0 ? void 0 : _a.id))
                return;
            if (!message.guildId)
                return;
            const config = yield this.getConfig(message.guildId);
            if (config.listenerChannelId !== message.channelId)
                return;
            const [l, r] = config.delimiterCharacters;
            const matchTags = ((_c = (_b = message.content) === null || _b === void 0 ? void 0 : _b.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g"))) !== null && _c !== void 0 ? _c : []).map(l => l.trim());
            if (!matchTags.includes(config.tags.announcement))
                return;
            const event = this.parseMessage(message.id, message.content, config);
            try {
                if (event.isValid) {
                    config.events.push(event);
                    yield message.react("✅");
                    yield this.service.update(config);
                }
                else {
                    yield message.react("❎");
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    updateEvent(oldMessage, newMessage) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (oldMessage.partial)
                yield oldMessage.fetch();
            if (newMessage.partial)
                yield newMessage.fetch();
            const config = yield this.getConfig(oldMessage.guildId);
            if (config.listenerChannelId !== oldMessage.channelId)
                return;
            const oldEvent = config.events.find(event => event.messageId === oldMessage.id);
            if (!oldEvent)
                return;
            const newEvent = this.parseMessage(oldMessage.id, newMessage.content, config);
            try {
                const reaction = newMessage.reactions.cache.find(reaction => reaction.me);
                if (reaction)
                    yield reaction.users.remove((_a = oldMessage.client.user) === null || _a === void 0 ? void 0 : _a.id);
                if (newEvent.isValid) {
                    yield newMessage.react("✅");
                    config.events[config.events.indexOf(oldEvent)] = newEvent;
                    yield this.service.update(config);
                }
                else {
                    yield newMessage.react("❎");
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    deleteEvent(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.partial)
                yield message.fetch();
            const config = yield this.getConfig(message.guildId);
            if (!config.events.find(event => event.messageId === message.id))
                return;
            config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
            yield this.service.update(config);
        });
    }
    static parseTriggerDuration(triggerTime) {
        const hold = dayjs(triggerTime, "HH:mm", true);
        return dayjs.duration({ hours: hold.hour(), minutes: hold.minute() });
    }
    reminderLoop(client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Task.waitTillReady(client);
            const now = dayjs();
            const configs = yield this.service.getAll();
            const alteredConfigs = [];
            for (const config of configs) {
                try {
                    if (!client.guilds.cache.has(config.guildId))
                        continue;
                    const postingGuild = yield client.guilds.fetch(config.guildId);
                    if (!postingGuild)
                        continue;
                    if (config.events.length > 0 && config.postingChannelId) {
                        const postingChannel = yield postingGuild.channels.fetch(config.postingChannelId);
                        if (!postingChannel)
                            continue;
                        for (const trigger of config.reminders) {
                            if (!trigger.timeDelta)
                                continue;
                            const triggerTime = EventManagerModule.parseTriggerDuration(trigger.timeDelta);
                            for (const event of config.events) {
                                const eventTime = dayjs(event.dateTime);
                                if (!now.isSame(eventTime, "date"))
                                    continue;
                                if (eventTime.diff(now, "minutes") === triggerTime.asMinutes()) {
                                    const messageValues = {
                                        "%everyone%": "@everyone",
                                        "%eventName%": event.name,
                                        "%hourDiff%": triggerTime.hours().toString(),
                                        "%minuteDiff%": triggerTime.minutes().toString()
                                    };
                                    yield postingChannel.send(trigger.message.replace(/%\w+%/g, (v) => messageValues[v] || v));
                                }
                            }
                        }
                    }
                    const before = config.events.length;
                    for (const past of config.events.filter(event => now.isAfter(dayjs(event.dateTime))))
                        config.events.splice(config.events.indexOf(past), 1);
                    if (before !== config.events.length)
                        alteredConfigs.push(config);
                }
                catch (err) {
                    console.error(err);
                }
            }
            if (alteredConfigs.length > 0) {
                yield this.service.bulkUpdate(alteredConfigs);
            }
        });
    }
    event(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.getConfig(interaction.guildId);
            const embed = new MessageEmbed().setColor("RANDOM");
            if (config.events.length <= 0) {
                embed.addField("Notice", "There are no upcoming events!");
                yield interaction.reply({ embeds: [embed] });
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
                const time = dayjs(event.dateTime).unix();
                embed.addField("Time Remaining:", `<t:${time}:R>`, false);
                embed.addField("Set For:", `<t:${time}:f>`, false);
            }
            else {
                embed.setTitle("Upcoming Events");
                for (const [index, event] of config.events.entries()) {
                    embed.addField(`Index ${index}:`, `${event.name}\n**Begins: <t:${dayjs(event.dateTime).unix()}:R>**`, false);
                }
            }
            yield interaction.reply({ embeds: [embed] });
        });
    }
    onReady(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const configs = yield this.service.getAll();
            for (const config of configs) {
                if (!config.listenerChannelId || !config.events.length)
                    continue;
                yield fetchMessages(client, config.guildId, config.listenerChannelId, config.events.map(event => event.messageId));
            }
        });
    }
}
//# sourceMappingURL=eventManagerModule.js.map