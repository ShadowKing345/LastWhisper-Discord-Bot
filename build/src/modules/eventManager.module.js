var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EventManagerModule_1;
import { MessageEmbed } from "discord.js";
import { DateTime, Duration } from "luxon";
import { injectable } from "tsyringe";
import { ModuleBase } from "../classes/moduleBase.js";
import { Task } from "../classes/task.js";
import { EventObj } from "../models/eventManager.model.js";
import { EventManagerConfigService } from "../services/eventManagerConfig.service.js";
import { fetchMessages } from "../utils/utils.js";
let EventManagerModule = EventManagerModule_1 = class EventManagerModule extends ModuleBase {
    service;
    constructor(service) {
        super();
        this.service = service;
        this.moduleName = "EventManager";
        this.commands = [
            {
                command: builder => builder
                    .setName("event")
                    .setDescription("Displays events.")
                    .addIntegerOption(option => option.setName("index").setDescription("The index for the event, starting at 0")),
                run: async (interaction) => this.event(interaction),
            },
        ];
        this.listeners = [
            { event: "messageCreate", run: async (_, message) => this.createEvent(message) },
            { event: "messageUpdate", run: async (_, old, message) => this.updateEvent(old, message) },
            { event: "messageDelete", run: async (_, message) => await this.deleteEvent(message) },
            { event: "ready", run: async (client) => this.onReady(client) },
        ];
        this.tasks = [
            {
                name: `${this.moduleName}#postMessageTask`,
                timeout: 60000,
                run: async (client) => await this.reminderLoop(client),
            },
        ];
    }
    static parseTriggerDuration(triggerTime) {
        const hold = DateTime.fromFormat(triggerTime, "HH:mm");
        return Duration.fromObject({ hours: hold.get("hour"), minutes: hold.get("minute") });
    }
    parseMessage(messageId, content, config) {
        const event = new EventObj(messageId);
        const hammerRegex = /<.*:(\d+):.*>/;
        const [l, r] = config.delimiterCharacters;
        const re = new RegExp(`${l}(.*)${r}([^${l}]*)`, "gm");
        const patternSplit = (content?.match(re) ?? []).map(l => {
            re.lastIndex = 0;
            const match = re.exec(l).slice(1, 3) ?? [null, null];
            return [match[0]?.trim(), match[1]?.trim()];
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
                        date = DateTime.fromFormat(value, config.dateTimeFormat, {});
                        if (date.isValid) {
                            event.dateTime = date.toUnixInteger();
                            break;
                        }
                    }
                    // Checks if it's hammer time.
                    matchedResult = value?.match(hammerRegex);
                    if (!matchedResult)
                        break;
                    unixTimeStr = matchedResult[1];
                    if (!unixTimeStr)
                        break;
                    number = Number(unixTimeStr);
                    if (isNaN(number))
                        break;
                    date = DateTime.fromSeconds(number);
                    if (!date.isValid)
                        break;
                    event.dateTime = date.toUnixInteger();
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
    async createEvent(message) {
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
            if (EventObj.isValid(event)) {
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
        if (oldMessage.partial)
            await oldMessage.fetch();
        if (newMessage.partial)
            await newMessage.fetch();
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
            if (EventObj.isValid(newEvent)) {
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
        if (message.partial)
            await message.fetch();
        const config = await this.getConfig(message.guildId);
        if (!config.events.find(event => event.messageId === message.id))
            return;
        config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
        await this.service.update(config);
    }
    async reminderLoop(client) {
        await Task.waitTillReady(client);
        const now = DateTime.now();
        const configs = await this.service.getAll();
        const alteredConfigs = [];
        for (const config of configs) {
            try {
                if (!client.guilds.cache.has(config.guildId))
                    continue;
                const postingGuild = await client.guilds.fetch(config.guildId);
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
                            const eventTime = DateTime.fromSeconds(event.dateTime);
                            if (Math.abs(eventTime.diff(now, "days").get("day")) > 1)
                                continue;
                            if (eventTime.get("minute") === triggerTime.as("minutes")) {
                                const messageValues = {
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
        const embed = new MessageEmbed().setColor("RANDOM");
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
            embed.addField("Time Remaining:", `<t:${event.dateTime}:R>`, false);
            embed.addField("Set For:", `<t:${event.dateTime}:f>`, false);
        }
        else {
            embed.setTitle("Upcoming Events");
            for (const [index, event] of config.events.entries()) {
                embed.addField(`Index ${index}:`, `${event.name}\n**Begins: <t:${event.dateTime}:R>**`, false);
            }
        }
        await interaction.reply({ embeds: [embed] });
    }
    async onReady(client) {
        const configs = await this.service.getAll();
        for (const config of configs) {
            if (!config.listenerChannelId || !config.events.length)
                continue;
            await fetchMessages(client, config.guildId, config.listenerChannelId, config.events.map(event => event.messageId));
        }
    }
};
EventManagerModule = EventManagerModule_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [EventManagerConfigService])
], EventManagerModule);
export { EventManagerModule };
//# sourceMappingURL=eventManager.module.js.map