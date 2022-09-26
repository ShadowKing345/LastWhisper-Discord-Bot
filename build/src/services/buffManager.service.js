var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BuffManagerService_1;
import { MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { singleton } from "tsyringe";
import { createLogger } from "../utils/logger/logger.decorator.js";
import { Task } from "../utils/models/task.js";
import { BuffManagerRepository } from "../repositories/buffManager.repository.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";
const skipping = "Skipping";
let BuffManagerService = BuffManagerService_1 = class BuffManagerService {
    buffManagerConfigRepository;
    logger;
    daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    constructor(buffManagerConfigRepository, logger) {
        this.buffManagerConfigRepository = buffManagerConfigRepository;
        this.logger = logger;
    }
    static getBuffId(week, date) {
        return BuffManagerService_1.daysToArray(week.days)[date.weekday - 1];
    }
    static daysToArray(days) {
        return [days.monday, days.tuesday, days.wednesday, days.thursday, days.friday, days.saturday, days.sunday];
    }
    createBuffEmbed(title, day, date) {
        this.logger.debug(`Creating Buff Embed.`);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: day.text,
            thumbnail: { url: day.imageUrl },
            footer: { text: date.toFormat("DDDD") },
        });
    }
    createWeekEmbed(title, week, days, date) {
        this.logger.debug(`Creating Week Embed.`);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: week.title,
            fields: BuffManagerService_1.daysToArray(week.days).map((dayId, index) => {
                const dow = this.daysOfWeek[index];
                const day = days.find(entry => entry.id === dayId) ?? { text: "No Buff Found!" };
                return { name: dow, value: day.text, inline: true };
            }),
            footer: { text: `Week ${date.get("weekNumber")}.` },
        });
    }
    async tryGetConfig(interaction) {
        const guildId = interaction.guildId;
        this.logger.debug(`Attempting to acquire configuration for guild guildId.`);
        const config = await this.findOneOrCreate(guildId);
        if (config.buffs.length <= 0) {
            await interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true });
            this.logger.debug(`No buffs were set in config.`);
            return [null, false];
        }
        if (config.weeks.filter(week => !("isEnabled" in week) || week.isEnabled).length <= 0) {
            await interaction.reply({ content: "Sorry, there are not enabled weeks set.", ephemeral: true });
            this.logger.debug(`No weeks were set in config.`);
            return [null, false];
        }
        this.logger.debug(`Returning results.`);
        return [config, true];
    }
    async postBuff(interaction, today = true) {
        const [config, flag] = await this.tryGetConfig(interaction);
        if (!flag) {
            return;
        }
        this.logger.debug(`Command invoked for buffs.`);
        const date = today ? DateTime.now() : DateTime.now().plus({ days: 1 });
        const title = `${today ? "Today's" : "Tomorrow's"} Buff Shall Be:`;
        this.logger.debug(`Posting buff message for the date ${date.toISO()}`);
        const week = config.weeks[date.get("weekNumber") % config.weeks.length];
        const buffId = BuffManagerService_1.getBuffId(week, date);
        const buff = config.buffs.find(day => day.id === buffId);
        if (!buff) {
            await interaction.reply({
                content: `Sorry, but the buff with id **${buffId}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
                ephemeral: true,
            });
            this.logger.debug(`Buff with id buffId does not exist.`);
            return;
        }
        await interaction.reply({ embeds: [this.createBuffEmbed(title, buff, date)] });
    }
    async postWeeksBuffs(interaction, thisWeek = true) {
        const [config, flag] = await this.tryGetConfig(interaction);
        if (!flag) {
            return;
        }
        this.logger.debug(`Command invoked for weeks.`);
        const date = thisWeek ? DateTime.now() : DateTime.now().plus({ week: 1 });
        const title = `The Buffs For ${thisWeek ? "The" : "Next"} Week Shall Be:`;
        this.logger.debug(`Posting week message for ${date.toISO()}`);
        const filteredWeeks = config.weeks.filter(week => week.isEnabled);
        const week = filteredWeeks[date.get("weekNumber") % filteredWeeks.length];
        await interaction.reply({ embeds: [this.createWeekEmbed(title, week, config.buffs, date)] });
    }
    async postDailyMessage(client) {
        if (!client.isReady()) {
            await Task.waitTillReady(client);
        }
        this.logger.debug("Posting daily buff message.");
        const configs = (await this.buffManagerConfigRepository.getAll())
            .filter(config => client.guilds.cache.has(config.guildId) && config.buffs.length > 0);
        const now = DateTime.now();
        for (const config of configs) {
            try {
                const messageSettings = config.messageSettings;
                if (!messageSettings.channelId || !messageSettings.hour)
                    continue;
                if (!now.hasSame(DateTime.fromFormat(messageSettings.hour, "HH:mm"), "minute"))
                    continue;
                const channel = await client.channels.fetch(messageSettings.channelId);
                if (!(channel?.isText && channel.guildId === config.guildId)) {
                    this.logger.warn(`Invalid channel messageSettings.channelId  ID for guild config.guildId. ${skipping}...`);
                    continue;
                }
                const filteredWeeks = config.weeks.filter(week => week.isEnabled);
                const week = filteredWeeks[now.weekNumber % filteredWeeks.length];
                const buffId = BuffManagerService_1.getBuffId(week, now);
                const buff = config.buffs.find(day => day.id === buffId);
                if (!buff) {
                    this.logger.warn(`Invalid buff ID buffId for guild config.guildId. ${skipping}...`);
                    continue;
                }
                this.logger.debug(`Posting buff message.`);
                await channel.send({ embeds: [this.createBuffEmbed(messageSettings.buffMessage, buff, now)] });
                if (messageSettings.dow !== null && messageSettings.dow === now.weekday) {
                    this.logger.debug(`Posting week message.`);
                    await channel.send({
                        embeds: [this.createWeekEmbed(messageSettings.weekMessage, week, config.buffs, now)],
                    });
                }
            }
            catch (error) {
                this.logger.error(error instanceof Error ? error + error.stack : error);
            }
        }
    }
    async findOneOrCreate(id) {
        let result = await this.buffManagerConfigRepository.findOne({ guildId: id });
        if (result)
            return result;
        result = new BuffManagerConfig();
        result.guildId = id;
        return await this.buffManagerConfigRepository.save(result);
    }
};
BuffManagerService = BuffManagerService_1 = __decorate([
    singleton(),
    __param(1, createLogger(BuffManagerService_1.name)),
    __metadata("design:paramtypes", [BuffManagerRepository, Object])
], BuffManagerService);
export { BuffManagerService };
//# sourceMappingURL=buffManager.service.js.map