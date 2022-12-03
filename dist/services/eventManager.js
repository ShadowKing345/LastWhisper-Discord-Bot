var EventManagerService_1;
import { __decorate, __metadata, __param } from "tslib";
import { EmbedBuilder, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { Timer } from "../utils/objects/timer.js";
import { fetchMessages } from "../utils/index.js";
import { EventManagerRepository } from "../repositories/eventManager.js";
import { EventManagerConfig, EventObj } from "../entities/event_manager/index.js";
import { Service } from "../utils/objects/service.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
import { service } from "../utils/decorators/index.js";
let EventManagerService = EventManagerService_1 = class EventManagerService extends Service {
    logger;
    constructor(repository, logger) {
        super(repository, EventManagerConfig);
        this.logger = logger;
    }
    async parseEvent(guildId, text) {
        const { dateTimeFormat, delimiterCharacters, tags } = await this.getConfig(guildId);
        return this.parseMessage(null, text, tags, dateTimeFormat, delimiterCharacters);
    }
    async findIndex(guildId, index) {
        const config = await this.getConfig(guildId);
        if (config.events.length < 1) {
            return null;
        }
        return index == null ? config.events : config.getEventByIndex(index);
    }
    async createContent(guildId, name, description, time, additional = []) {
        const config = await this.getConfig(guildId);
        const [l, r] = config.delimiterCharacters;
        let result = l + config.tags.announcement + r + name + "\n";
        result += `${l}${config.tags.description}${r}\n${description}\n`;
        result += `${l}${config.tags.dateTime}${r}\n${time}\n`;
        for (const [k, v] of additional) {
            result += `${l}${k}${r}\n${v}\n`;
        }
        return result;
    }
    async create(guildId, _id, _content, _channelId) {
        const config = await this.getConfig(guildId);
        const event = new EventObj();
        event.guildConfig = config;
        event.name = "Test";
        event.description = "Fishing today";
        event.dateTime = DateTime.now().plus({ day: 30 }).toUnixInteger();
        event.additional = [["Hello", "World"]];
        await this.repository.db.dataSource.getRepository(EventObj).save(event);
        return event;
    }
    async update(guildId, messageId, content) {
        const config = await this.getConfig(guildId);
        const oldEvent = config.events.find(event => event.id === messageId);
        if (!oldEvent) {
            throw new Error("Event does not exist.");
        }
        const event = this.parseMessage(messageId, content, config.tags, config.dateTimeFormat, config.delimiterCharacters);
        if (!event.isValid) {
            return null;
        }
        await this.repository.save(config);
        return event;
    }
    async updateByIndex(guildId, index, content) {
        const config = await this.getConfig(guildId);
        const oldEvent = config.getEventByIndex(index);
        const event = this.parseMessage(oldEvent.id, content, config.tags, config.dateTimeFormat, config.delimiterCharacters);
        if (!event.isValid) {
            return null;
        }
        await this.repository.save(config);
        return event;
    }
    async cancel(guildId, id) {
        const config = await this.getConfig(guildId);
        const index = config.events.findIndex(event => event.id === id);
        if (index === -1)
            return;
        config.events.splice(index, 1);
        await this.repository.save(config);
    }
    async cancelByIndex(guildId, index) {
        const config = await this.getConfig(guildId);
        config.events.splice(index % config.events.length, 1);
        await this.repository.save(config);
    }
    async eventExists(guildId, id) {
        const config = await this.getConfig(guildId);
        return config.events.findIndex(event => event.id === id) !== -1;
    }
    async onReady(client) {
        const promises = [];
        const configs = await this.repository.getAll();
        for (const config of configs) {
            if (!config.listenerChannelId || config.events?.length < 1)
                continue;
            const messageIds = [];
            for (const event of config.events) {
                if (!event.id) {
                    messageIds.push(event.id);
                }
            }
            promises.push(fetchMessages(client, config.listenerChannelId, messageIds));
        }
        await Promise.all(promises);
    }
    async reminderLoop(client) {
        await Timer.waitTillReady(client);
        const now = DateTime.now();
        const alteredConfigs = [];
        const configs = await this.repository
            .getAll()
            .then(configs => configs.filter(config => config.postingChannelId && config.events.length > 0 && client.guilds.cache.has(config.guildId)));
        for (const config of configs) {
            try {
                const postingChannel = await client.channels.fetch(config.postingChannelId);
                if (!(postingChannel.type === ChannelType.GuildText && postingChannel.guildId === config.guildId)) {
                    this.logger.warn("Either posting channel does not exist or it is not inside of guild. Skipping...");
                    continue;
                }
                for (const reminder of config.reminders.filter(trigger => trigger.timeDelta)) {
                    const reminderTimeDelta = reminder.asDuration;
                    for (const event of config.events) {
                        const eventTime = DateTime.fromSeconds(event.dateTime);
                        if (eventTime.diff(now, ["days"]).days > 1)
                            continue;
                        const difference = eventTime.minus(reminderTimeDelta);
                        if (difference.hour === now.hour && difference.minute === now.minute) {
                            const messageValues = {
                                "%everyone%": "@everyone",
                                "%eventName%": event.name,
                                "%hourDiff%": reminderTimeDelta.hours.toString(),
                                "%minuteDiff%": reminderTimeDelta.minutes.toString(),
                            };
                            await postingChannel.send(reminder.message.replace(/%\w+%/g, v => messageValues[v] || v));
                        }
                    }
                }
                let changeFlag = false;
                config.events.forEach((event, index, array) => {
                    if (event.dateTime <= now.toUnixInteger()) {
                        array.splice(index, 1);
                        changeFlag = true;
                    }
                });
                if (changeFlag) {
                    alteredConfigs.push(config);
                }
            }
            catch (error) {
                this.logger.error(error instanceof Error ? error.stack : error);
            }
        }
        if (alteredConfigs.length > 0) {
            await this.repository.bulkSave(alteredConfigs);
        }
    }
    createEventEmbed(event) {
        return new EmbedBuilder({
            title: event.name,
            description: event.description,
            fields: [
                { name: "Time", value: `Set for: <t:${event.dateTime}:F>\nTime Left: <t:${event.dateTime}:R>` },
                ...event.additional.map(pair => ({ name: pair[0], value: pair[1], inline: true })),
            ],
        }).setColor("Random");
    }
    regexpEscape(text) {
        return text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    parseMessage(id, content, tags, dateTimeFormats, delimiter) {
        const [l, r] = delimiter.map(c => this.regexpEscape(c));
        const event = new EventObj();
        event.id = id;
        const regExp = new RegExp(`${l}(.*?)${r}([^${l}]*)`, "g");
        for (const [, k, v] of content.matchAll(regExp)) {
            if (!k || !v)
                continue;
            const key = k.trim(), value = v.trim();
            let date, time;
            switch (key) {
                case tags.announcement:
                    event.name = value;
                    break;
                case tags.description:
                    event.description = value;
                    break;
                case tags.dateTime:
                    if (dateTimeFormats.length > 0) {
                        let flag = false;
                        for (const format of dateTimeFormats) {
                            date = DateTime.fromFormat(value, format);
                            if (date.isValid) {
                                event.dateTime = date.toUnixInteger();
                                flag = true;
                                break;
                            }
                        }
                        if (flag)
                            break;
                    }
                    time = Number(value.match(/<.:(\d+):.>/)?.[1] ?? undefined);
                    if (!time || isNaN(time))
                        break;
                    date = DateTime.fromSeconds(time);
                    if (!date.isValid)
                        break;
                    event.dateTime = date.toUnixInteger();
                    break;
                default:
                    if (!tags.exclusionList.every(e => e !== key))
                        continue;
                    event.additional.push([key, value]);
                    break;
            }
        }
        return event;
    }
};
EventManagerService = EventManagerService_1 = __decorate([
    service(),
    __param(1, createLogger(EventManagerService_1.name)),
    __metadata("design:paramtypes", [EventManagerRepository, Object])
], EventManagerService);
export { EventManagerService };
//# sourceMappingURL=eventManager.js.map