var BuffManagerService_1;
import { __decorate, __metadata } from "tslib";
import { EmbedBuilder, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { Timer } from "../utils/objects/timer.js";
import { Service } from "./service.js";
import { ServiceError } from "../utils/errors/index.js";
import { service } from "../utils/decorators/index.js";
import { WeekRepository } from "../repositories/buffManager/weekRepository.js";
import { BuffManagerSettingsRepository } from "../repositories/buffManager/buffManagerSettingsRepository.js";
import { Logger } from "../config/logger.js";
let BuffManagerService = BuffManagerService_1 = class BuffManagerService extends Service {
    logger = new Logger(BuffManagerService_1);
    weekRepository;
    buffManagerSettingsRepository;
    constructor(weekRepository, messageSettingsRepository) {
        super();
        this.weekRepository = weekRepository;
        this.buffManagerSettingsRepository = messageSettingsRepository;
    }
    async getBuffByDate(guildId, date) {
        const week = await this.getWeekByDate(guildId, date);
        return week?.getBuff(date);
    }
    async getWeekByDate(guildId, date) {
        return await this.weekRepository.getWeekOfYear(guildId, date);
    }
    async postDailyMessage(client) {
        await Timer.waitTillReady(client);
        this.logger.debug("Posting daily buff message.");
        const messageSettings = await this.buffManagerSettingsRepository.getActiveSettings();
        const now = DateTime.now();
        for (const settings of messageSettings) {
            try {
                if (!now.hasSame(DateTime.fromFormat(settings.hour, "HH:mm"), "minute")) {
                    continue;
                }
                const channel = await client.channels.fetch(settings.channelId);
                if (!(channel?.type === ChannelType.GuildText && channel.guildId === settings.guildId)) {
                    this.logger.warn(`Invalid channel ID for a guild. Skipping...`);
                    continue;
                }
                const week = await this.weekRepository.getWeekOfYear(settings.guildId, now);
                const buff = week.getBuff(now);
                const embeds = [];
                if (!buff) {
                    this.logger.warn(`Invalid buff ID buffId for guild config.guildId. Skipping...`);
                    continue;
                }
                this.logger.debug(`Posting buff message.`);
                embeds.push(this.createBuffEmbed(settings.buffMessage, buff, now));
                if (!isNaN(settings.dow) && Number(settings.dow) === now.weekday) {
                    this.logger.debug(`Posting week message.`);
                    embeds.push(this.createWeekEmbed(settings.weekMessage, week, now));
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
            fields: week.days.toArray.map(([day, buff]) => ({
                name: day,
                value: buff?.text ?? "No buff found.",
                inline: true,
            })),
            footer: { text: `Week ${date.get("weekNumber")}.` },
        }).setColor("Random");
    }
};
BuffManagerService = BuffManagerService_1 = __decorate([
    service(),
    __metadata("design:paramtypes", [WeekRepository,
        BuffManagerSettingsRepository])
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