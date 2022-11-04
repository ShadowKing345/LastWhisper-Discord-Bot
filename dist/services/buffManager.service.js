var BuffManagerService_1;
import { __decorate, __metadata, __param } from "tslib";
import { EmbedBuilder, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { singleton } from "tsyringe";
import { createLogger } from "../utils/loggerService.js";
import { Timer } from "../utils/objects/timer.js";
import { BuffManagerRepository } from "../repositories/buffManager.repository.js";
import { Service } from "../utils/objects/service.js";
let BuffManagerService = BuffManagerService_1 = class BuffManagerService extends Service {
    logger;
    daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    constructor(repository, logger) {
        super(repository);
        this.logger = logger;
    }
    async postBuff(interaction, date) {
        const config = await this.tryGetConfig(interaction);
        if (!config)
            return;
        this.logger.debug(`Command invoked for buffs.\nPosting buff message for the date ${date.toISO()}.`);
        const week = config.getWeekOfYear(date);
        const buff = config.getBuff(week.getBuffId(date));
        if (!buff) {
            this.logger.debug(`Buff did not exit.`);
            return interaction.reply({
                content: `Sorry, The buff for the date ${date.toISO()} does not exist in the collection of buffs. Kindly contact a manager or administration to resolve this issue.`,
                ephemeral: true,
            });
        }
        return interaction.reply({ embeds: [this.createBuffEmbed("The Buff Shall Be:", buff, date)] });
    }
    async postWeek(interaction, date) {
        const config = await this.tryGetConfig(interaction);
        if (!config)
            return;
        this.logger.debug(`Command invoked for weeks.\nPosting week message for ${date.toISO()}.`);
        return interaction.reply({ embeds: [this.createWeekEmbed("The Buffs For The Week Shall Be:", config, date)] });
    }
    async postDailyMessage(client) {
        await Timer.waitTillReady(client);
        this.logger.debug("Posting daily buff message.");
        const configs = await this.repository
            .getAll()
            .then((configs) => configs.filter((config) => client.guilds.cache.has(config.guildId) && config.buffs.length > 0));
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
                    embeds.push(this.createWeekEmbed(messageSettings.weekMessage, config, now, week));
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
    createWeekEmbed(title, config, date, week = config.getWeekOfYear(date)) {
        this.logger.debug(`Creating Week Embed.`);
        if (!week) {
            throw new Error("Cannot find a valid week.");
        }
        return new EmbedBuilder({
            title: title,
            description: week.title,
            fields: Array(...week.days).map((buffId, index) => {
                const dow = this.daysOfWeek[index];
                const day = config.getBuff(buffId);
                return { name: dow, value: day?.text ?? "No buff found.", inline: true };
            }),
            footer: { text: `Week ${date.get("weekNumber")}.` },
        }).setColor("Random");
    }
    async tryGetConfig(interaction) {
        const guildId = interaction.guildId;
        this.logger.debug(`Attempting to acquire configuration for guild guildId.`);
        const config = await this.findOneOrCreate(guildId);
        if (config.buffs?.length < 1) {
            this.logger.debug(`No buffs were set in config.`);
            await interaction.reply({
                content: "Sorry, there are not buffs set.",
                ephemeral: true,
            });
            return null;
        }
        if (config.getFilteredWeeks?.length < 1) {
            this.logger.debug(`No weeks were set in config.`);
            await interaction.reply({
                content: "Sorry, there are not enabled weeks set.",
                ephemeral: true,
            });
            return null;
        }
        this.logger.debug(`Returning results.`);
        return config;
    }
};
BuffManagerService = BuffManagerService_1 = __decorate([
    singleton(),
    __param(1, createLogger(BuffManagerService_1.name)),
    __metadata("design:paramtypes", [BuffManagerRepository, Object])
], BuffManagerService);
export { BuffManagerService };
//# sourceMappingURL=buffManager.service.js.map