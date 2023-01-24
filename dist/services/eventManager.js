var EventManagerService_1;
import { __decorate, __metadata } from "tslib";
import { EmbedBuilder, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { Timer } from "../utils/objects/timer.js";
import { fetchMessages } from "../utils/index.js";
import { Service } from "./service.js";
import { service } from "../utils/decorators/index.js";
import { WrongChannelError } from "../utils/errors/index.js";
import { EventManagerSettingsRepository } from "../repositories/eventManager/eventManagerSettingsRepository.js";
import { EventObject } from "../entities/eventManager/index.js";
import { EventObjectRepository } from "../repositories/eventManager/eventObjectRepository.js";
import { EventReminderRepository } from "../repositories/eventManager/eventReminderRepository.js";
import { LessThanOrEqual } from "typeorm";
import { Logger } from "../config/logger.js";
let EventManagerService = EventManagerService_1 = class EventManagerService extends Service {
    logger = new Logger(EventManagerService_1);
    eventManagerSettingsRepository;
    eventObjectRepository;
    eventReminderRepository;
    constructor(eventManagerSettingsRepository, eventObjectRepository, eventReminderRepository) {
        super();
        this.eventManagerSettingsRepository = eventManagerSettingsRepository;
        this.eventObjectRepository = eventObjectRepository;
        this.eventReminderRepository = eventReminderRepository;
    }
    async parseEvent(guildId, text) {
        const config = await this.eventManagerSettingsRepository.findOneOrCreateByGuildId(guildId);
        return this.parseMessage(null, text, config);
    }
    async findByIndex(guildId, index) {
        const events = await this.eventObjectRepository.getEventsByGuildId(guildId);
        if (events.length < 1) {
            return null;
        }
        return index == null ? events : events[index % events.length];
    }
    async createContent(guildId, name, description, time, additional = []) {
        const config = await this.eventManagerSettingsRepository.findOneOrCreateByGuildId(guildId);
        const [l, r] = config.delimiterCharacters;
        let result = l + config.announcement + r + name + "\n";
        result += `${l}${config.description}${r}\n${description}\n`;
        result += `${l}${config.dateTime}${r}\n${time}\n`;
        for (const [k, v] of additional) {
            result += `${l}${k}${r}\n${v}\n`;
        }
        return result;
    }
    async create(guildId, id, content, channelId) {
        const config = await this.eventManagerSettingsRepository.findOneOrCreateByGuildId(guildId);
        if (channelId && config.listenerChannelId !== channelId) {
            throw new WrongChannelError("Listening channel is not the same as the provided channel ID.");
        }
        const event = this.parseMessage(id, content, config);
        if (!event.isValid) {
            return null;
        }
        event.guildId = guildId;
        return this.eventObjectRepository.save(event);
    }
    async update(guildId, messageId, content) {
        const config = await this.eventManagerSettingsRepository.findOneOrCreateByGuildId(guildId);
        const oldEvent = await this.eventObjectRepository.findOne({ where: { guildId, id: messageId } });
        if (!oldEvent) {
            throw new Error("Event does not exist.");
        }
        const event = this.parseMessage(messageId, content, config);
        if (!event.isValid) {
            return null;
        }
        return this.eventObjectRepository.save(event);
    }
    async updateByIndex(guildId, index, content) {
        const config = await this.eventManagerSettingsRepository.findOneOrCreateByGuildId(guildId);
        const oldEvent = await this.findByIndex(guildId, index);
        const event = this.parseMessage(oldEvent.messageId, content, config);
        if (!event.isValid) {
            return null;
        }
        return this.eventObjectRepository.save(event);
    }
    async cancel(guildId, messageId) {
        const index = await this.eventObjectRepository.findOne({ where: { guildId, messageId: messageId } });
        if (!index)
            return;
        await this.eventObjectRepository.delete({ id: index.id });
    }
    async cancelByIndex(guildId, index) {
        const event = await this.findByIndex(guildId, index);
        await this.eventObjectRepository.delete({ id: event.id });
    }
    async eventExists(guildId, messageId) {
        return await this.eventObjectRepository.findOne({ where: { guildId, messageId } }) != null;
    }
    async onReady(client) {
        const promises = [];
        const settings = await this.eventManagerSettingsRepository.getAll();
        for (const setting of settings) {
            const events = await this.eventObjectRepository.getEventsByGuildId(setting.guildId);
            if (!setting.listenerChannelId || events.length < 1)
                continue;
            const messageIds = [];
            for (const event of events) {
                if (!event.messageId) {
                    messageIds.push(event.messageId);
                }
            }
            promises.push(fetchMessages(client, setting.listenerChannelId, messageIds));
        }
        await Promise.all(promises);
    }
    async reminderLoop(client) {
        await Timer.waitTillReady(client);
        const now = DateTime.now();
        for (const setting of await this.eventManagerSettingsRepository.getAll()) {
            try {
                const postingChannel = await client.channels.fetch(setting.postingChannelId);
                if (!(postingChannel.type === ChannelType.GuildText && postingChannel.guildId === setting.guildId)) {
                    this.logger.warn("Either posting channel does not exist or it is not inside of guild. Skipping...");
                    continue;
                }
                for (const reminder of await this.eventReminderRepository.findAll({ where: { guildId: setting.guildId } })) {
                    const reminderTimeDelta = reminder.asDuration;
                    for (const event of await this.eventObjectRepository.getEventsByGuildId(setting.guildId)) {
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
                await this.eventObjectRepository.delete({ dateTime: LessThanOrEqual(now.toUnixInteger()) });
            }
            catch (error) {
                this.logger.error(error instanceof Error ? error.stack : error);
            }
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
    parseMessage(messageId, content, config) {
        const [l, r] = config.delimiterCharacters.map(c => this.regexpEscape(c));
        const event = new EventObject();
        event.messageId = messageId;
        const regExp = new RegExp(`${l}(.*?)${r}([^${l}]*)`, "g");
        for (const [, k, v] of content.matchAll(regExp)) {
            if (!k || !v)
                continue;
            const key = k.trim(), value = v.trim();
            let date, time;
            switch (key) {
                case config.announcement:
                    event.name = value;
                    break;
                case config.description:
                    event.description = value;
                    break;
                case config.dateTime:
                    if (config.dateTimeFormat.length > 0) {
                        let flag = false;
                        for (const format of config.dateTimeFormat) {
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
                    if (!config.exclusionList.every(e => e !== key))
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
    __metadata("design:paramtypes", [EventManagerSettingsRepository,
        EventObjectRepository,
        EventReminderRepository])
], EventManagerService);
export { EventManagerService };
//# sourceMappingURL=eventManager.js.map