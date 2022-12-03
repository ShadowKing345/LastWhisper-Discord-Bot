var BuffManagerService_1;
import { __decorate, __metadata, __param } from "tslib";
import { EmbedBuilder, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { createLogger } from "../utils/loggerService.js";
import { Timer } from "../utils/objects/timer.js";
import { BuffManagerRepository } from "../repositories/buffManager.js";
import { BuffManagerConfig, WeekDTO } from "../entities/buff_manager/index.js";
import { Service } from "../utils/objects/service.js";
import { ServiceError } from "../utils/errors/index.js";
import { service } from "../utils/decorators/index.js";
let BuffManagerService = BuffManagerService_1 = class BuffManagerService extends Service {
    logger;
    constructor(repository, logger) {
        super(repository, BuffManagerConfig);
        this.logger = logger;
    }
    async getBuffByDate(guildId, date) {
        const config = await this.tryGetConfig(guildId);
        const week = config.getWeekOfYear(date);
        return config.getBuff(week.getBuffId(date));
    }
    async getWeekByDate(guildId, date) {
        const config = await this.tryGetConfig(guildId);
        return WeekDTO.map(config.getWeekOfYear(date), config);
    }
    async postDailyMessage(client) {
        await Timer.waitTillReady(client);
        this.logger.debug("Posting daily buff message.");
        const configs = await this.repository
            .getAll()
            .then(configs => configs.filter(config => client.guilds.cache.has(config.guildId) && config.buffs.length > 0));
        const now = DateTime.now();
        for (const config of configs) {
            try {
                const messageSettings = config.messageSettings;
                if (!messageSettings.channelId || !messageSettings.hour)
                    continue;
                if (!now.hasSame(DateTime.fromFormat(messageSettings.hour, "HH:mm"), "minute")) {
                    continue;
                }
                const channel = await client.channels.fetch(messageSettings.channelId);
                if (!(channel?.type === ChannelType.GuildText && channel.guildId === config.guildId)) {
                    this.logger.warn(`Invalid channel ID for a guild. Skipping...`);
                    continue;
                }
                const week = config.getWeekOfYear(now);
                const buff = config.getBuff(week.getBuffId(now));
                const embeds = [];
                if (!buff) {
                    this.logger.warn(`Invalid buff ID buffId for guild config.guildId. Skipping...`);
                    continue;
                }
                this.logger.debug(`Posting buff message.`);
                embeds.push(this.createBuffEmbed(messageSettings.buffMessage, buff, now));
                if (!isNaN(messageSettings.dow) && Number(messageSettings.dow) === now.weekday) {
                    this.logger.debug(`Posting week message.`);
                    embeds.push(this.createWeekEmbed(messageSettings.weekMessage, WeekDTO.map(week, config), now));
                }
                await channel.send({ embeds });
            }
            catch (error) {
                this.logger.error(error instanceof Error ? error.stack : error);
            }
        }
    }
    createBuffEmbed(title, buff, date) {
        this.logger.debug(`Creating Buff Embed.`);
        return new EmbedBuilder({
            title: title,
            description: buff.text,
            thumbnail: { url: buff.imageUrl },
            footer: { text: date.toFormat("DDDD") },
        }).setColor("Random");
    }
    createWeekEmbed(title, week, date) {
        this.logger.debug(`Creating Week Embed.`);
        if (!week) {
            throw new Error("Cannot find a valid week.");
        }
        return new EmbedBuilder({
            title: title,
            description: week.title,
            fields: Array(...week.days).map(([day, buff]) => ({
                name: day,
                value: buff?.text ?? "No buff found.",
                inline: true,
            })),
            footer: { text: `Week ${date.get("weekNumber")}.` },
        }).setColor("Random");
    }
    async tryGetConfig(guildId) {
        const config = await this.getConfig(guildId);
        if ((config.buffs ?? []).length < 1) {
            this.logger.debug(`No buffs were set in config.`);
            throw new BuffManagerTryGetError("No buffs were set", BuffManagerTryGetErrorReasons.BUFFS);
        }
        if (config.getFilteredWeeks?.length < 1) {
            this.logger.debug(`No weeks were set in config.`);
            throw new BuffManagerTryGetError("No weeks were set", BuffManagerTryGetErrorReasons.WEEKS);
        }
        this.logger.debug(`Returning results.`);
        return config;
    }
};
BuffManagerService = BuffManagerService_1 = __decorate([
    service(),
    __param(1, createLogger(BuffManagerService_1.name)),
    __metadata("design:paramtypes", [BuffManagerRepository, Object])
], BuffManagerService);
export { BuffManagerService };
export class BuffManagerTryGetError extends ServiceError {
    reason;
    constructor(message, reason) {
        super(message);
        this.reason = reason;
    }
}
export var BuffManagerTryGetErrorReasons;
(function (BuffManagerTryGetErrorReasons) {
    BuffManagerTryGetErrorReasons[BuffManagerTryGetErrorReasons["UNKNOWN"] = 0] = "UNKNOWN";
    BuffManagerTryGetErrorReasons[BuffManagerTryGetErrorReasons["WEEKS"] = 1] = "WEEKS";
    BuffManagerTryGetErrorReasons[BuffManagerTryGetErrorReasons["BUFFS"] = 2] = "BUFFS";
})(BuffManagerTryGetErrorReasons || (BuffManagerTryGetErrorReasons = {}));
//# sourceMappingURL=buffManager.js.map