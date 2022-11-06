var EventManagerService_1;
import { __decorate, __metadata, __param } from "tslib";
import { EmbedBuilder, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { singleton } from "tsyringe";
import { Timer } from "../utils/objects/timer.js";
import { fetchMessages } from "../utils/index.js";
import { EventManagerRepository } from "../repositories/eventManager.repository.js";
import { EventObj } from "../models/event_manager/index.js";
import { Service } from "../utils/objects/service.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
let EventManagerService = EventManagerService_1 = class EventManagerService extends Service {
    logger;
    constructor(repository, logger) {
        super(repository);
        this.logger = logger;
    }
    createEventCommand(interaction) {
        return interaction.reply("Yellow");
    }
    updateEventCommand(interaction) {
        return interaction.reply("Yellow");
    }
    cancelEventCommand(interaction) {
        return interaction.reply("Yellow");
    }
    async testEventCommand(interaction) {
        const response = await interaction.deferReply();
        const config = await this.getConfig(interaction.guildId);
        const text = interaction.options.getString("text", true);
        const event = this.parseMessage(null, text, config);
        await interaction.editReply({
            embeds: [
                new EmbedBuilder({
                    title: event.isValid ? "Event is valid." : "Event is not valid.",
                    fields: [
                        { name: "Name", value: event.name ?? "Name cannot be null." },
                        { name: "Description", value: event.description ?? "Description cannot be null." },
                        {
                            name: "Time",
                            value: event.dateTime ?
                                `<t:${event.dateTime}:F>` :
                                "The format for the time was not correct. Use the Hammer time syntax to help."
                        },
                        { name: "Additional", value: event.additional.map(pair => `[${pair[0]}]\n${pair[1]}`).join("\n") }
                    ]
                }).setColor(event.isValid ? "Green" : "Red")
            ]
        });
        return response;
    }
    async listEventCommand(interaction) {
        const config = await this.getConfig(interaction.guildId);
        if (config.events.length < 1) {
            return interaction.reply({
                embeds: [new EmbedBuilder({
                        title: "No events were set.",
                        description: "There are currently no active events going on in your guild."
                    })]
            });
        }
        const index = interaction.options.getInteger("index");
        const embed = index != null ?
            this.createEventEmbed(config.getEventByIndex(index)) :
            new EmbedBuilder({
                title: "Upcoming Events",
                fields: config.events.map((event, index) => ({
                    name: `Index ${index}:`,
                    value: `${event.name}\n**Begins: <t:${event.dateTime}:R>**`,
                    inline: false
                }))
            }).setColor("Random");
        return interaction.reply({ embeds: [embed] });
    }
    async createEvent(message) {
        if (message.partial) {
            await message.fetch();
        }
        if (message.author.id === message.client.application?.id)
            return;
        if (!message.guildId)
            return;
        const config = await this.getConfig(message.guildId);
        if (config.listenerChannelId !== message.channelId)
            return;
        const [l, r] = config.delimiterCharacters;
        const regex = new RegExp(`${l}(.*?)${r}`, "g");
        let flag = false;
        let match = regex.exec(message.content);
        while (match != null) {
            if (match[1].trim() === config.tags.announcement) {
                flag = true;
                break;
            }
            match = regex.exec(message.content);
        }
        if (!flag) {
            return;
        }
        const event = this.parseMessage(message.id, message.content, config);
        try {
            if (event.isValid && event.dateTime > DateTime.now().toUnixInteger()) {
                config.events.push(event);
                await message.react("✅");
                await this.repository.save(config);
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
        if (oldMessage.partial)
            await oldMessage.fetch();
        if (newMessage.partial)
            await newMessage.fetch();
        const config = await this.getConfig(oldMessage.guildId);
        if (config.listenerChannelId !== oldMessage.channelId)
            return;
        const oldEvent = config.events.find((event) => event.messageId === oldMessage.id);
        if (!oldEvent)
            return;
        const newEvent = this.parseMessage(oldMessage.id, newMessage.content, config);
        try {
            const reaction = newMessage.reactions.cache.find((reaction) => reaction.me);
            if (reaction)
                await reaction.users.remove(oldMessage.client.user?.id);
            if (newEvent.isValid) {
                await newMessage.react("✅");
                config.events[config.events.indexOf(oldEvent)] = newEvent;
                await this.repository.save(config);
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
        if (message.partial)
            await message.fetch();
        const config = await this.getConfig(message.guildId);
        if (!config.events.find((event) => event.messageId === message.id))
            return;
        config.events.splice(config.events.findIndex((event) => event.messageId === message.id), 1);
        await this.repository.save(config);
    }
    async onReady(client) {
        const configs = await this.repository.findAll({});
        for (const config of configs) {
            if (!config.listenerChannelId || !config.events.length)
                continue;
            await fetchMessages(client, config.listenerChannelId, config.events.map((event) => event.messageId));
        }
    }
    async reminderLoop(client) {
        await Timer.waitTillReady(client);
        const now = DateTime.now();
        const alteredConfigs = [];
        const configs = await this.repository.getAll()
            .then(configs => configs.filter((config) => config.postingChannelId && config.events.length > 0 && client.guilds.cache.has(config.guildId)));
        for (const config of configs) {
            try {
                const postingChannel = (await client.channels.fetch(config.postingChannelId));
                if (!(postingChannel.type === ChannelType.GuildText && postingChannel.guildId === config.guildId)) {
                    this.logger.warn("Either posting channel does not exist or it is not inside of guild. Skipping...");
                    continue;
                }
                for (const reminder of config.reminders.filter((trigger) => trigger.timeDelta)) {
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
                                "%minuteDiff%": reminderTimeDelta.minutes.toString()
                            };
                            await postingChannel.send(reminder.message.replace(/%\w+%/g, (v) => messageValues[v] || v));
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
    parseMessage(messageId, content, { tags, dateTimeFormat, delimiterCharacters: [l, r] }) {
        const event = new EventObj({ messageId });
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
                    if (dateTimeFormat.length > 0) {
                        let flag = false;
                        for (const format of dateTimeFormat) {
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
                    if (!tags.exclusionList.every((e) => e !== key))
                        continue;
                    event.additional.push([key, value]);
                    break;
            }
        }
        return event;
    }
    createEventEmbed(event) {
        return new EmbedBuilder({
            title: event.name,
            description: event.description,
            fields: [
                { name: "Time", value: `Set for: <t:${event.dateTime}:F>\nTime Left: <t:${event.dateTime}:R>` },
                ...event.additional.map(pair => ({ name: pair[0], value: pair[1], inline: true }))
            ]
        }).setColor("Random");
    }
};
EventManagerService = EventManagerService_1 = __decorate([
    singleton(),
    __param(1, createLogger(EventManagerService_1.name)),
    __metadata("design:paramtypes", [EventManagerRepository, Object])
], EventManagerService);
export { EventManagerService };
//# sourceMappingURL=eventManager.service.js.map