var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BuffManagerService_1;
import chalk from "chalk";
import { MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { injectable } from "tsyringe";
import { Task } from "../classes/task.js";
import { BuffManagerConfig, Days } from "../models/buffManager.model.js";
import { BuffManagerConfigRepository } from "../repositories/buffManagerConfig.repository.js";
import { buildLogger } from "../utils/logger.js";
let BuffManagerService = BuffManagerService_1 = class BuffManagerService {
    buffManagerConfigRepository;
    logger = buildLogger(BuffManagerService_1.name);
    daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    constructor(buffManagerConfigRepository) {
        this.buffManagerConfigRepository = buffManagerConfigRepository;
    }
    createBuffEmbed(title, day, date) {
        this.logger.debug(`Creating ${chalk.cyan("Buff Embed")}.`);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: day.text,
            thumbnail: { url: day.imageUrl },
            footer: { text: date.toFormat("dddd Do MMMM YYYY") },
        });
    }
    createWeekEmbed(title, week, days, date) {
        this.logger.debug(`Creating ${chalk.cyan("Week Embed")}.`);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: week.title,
            fields: Days.toArray(week.days).map((dayId, index) => {
                const dow = this.daysOfWeek[index];
                const day = days.find(entry => entry.id === dayId) ?? { text: "No Buff Found!" };
                return { name: dow, value: day.text, inline: true };
            }),
            footer: { text: `Week ${date.get("weekNumber")}.` },
        });
    }
    async tryGetConfig(interaction) {
        const guildId = interaction.guildId;
        this.logger.debug(`Attempting to acquire ${chalk.blue("configuration")} for guild ${chalk.yellow(guildId)}.`);
        const config = await this.findOneOrCreate(guildId);
        if (config.buffs.length <= 0) {
            await interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true });
            this.logger.debug(`${chalk.red("Expected Failure:")} No ${chalk.blue("buffs")} were set in config.`);
            return [null, false];
        }
        if (config.weeks.filter(week => !("isEnabled" in week) || week.isEnabled).length <= 0) {
            await interaction.reply({ content: "Sorry, there are not enabled weeks set.", ephemeral: true });
            this.logger.debug(`${chalk.red("Expected Failure:")} No ${chalk.blue("weeks")} were set in config.`);
            return [null, false];
        }
        this.logger.debug(`${chalk.green("Success:")} Returning results.`);
        return [config, true];
    }
    async postBuff(interaction, subCommand) {
        const [config, flag] = await this.tryGetConfig(interaction);
        if (!flag) {
            return;
        }
        this.logger.debug(`Command invoked for ${chalk.blue("buffs")}.`);
        const today = subCommand === "today";
        const date = today ? DateTime.now() : DateTime.now().plus({ days: 1 });
        const title = `${today ? "Today's" : "Tomorrow's"} Buff Shall Be:`;
        this.logger.debug(`Posting ${chalk.blue("buff")} message for the date ${chalk.yellow(date.toISO())}`);
        const week = config.weeks[date.get("weekNumber") % config.weeks.length];
        const buffId = Days.toArray(week.days)[date.get("weekday")];
        const buff = config.buffs.find(day => day.id === buffId);
        if (!buff) {
            await interaction.reply({
                content: `Sorry, but the buff with id **${buffId}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
                ephemeral: true,
            });
            this.logger.debug(`${chalk.red("Expected Failure:")} ${chalk.blue("Buff")} with id ${chalk.yellow(buffId)} does not exist.`);
            return;
        }
        await interaction.reply({ embeds: [this.createBuffEmbed(title, buff, date)] });
    }
    async postWeeksBuffs(interaction, subCommand) {
        const [config, flag] = await this.tryGetConfig(interaction);
        if (!flag) {
            return;
        }
        this.logger.debug(`Command invoked for ${chalk.blue("weeks")}.`);
        const thisWeek = subCommand === "this_week";
        const date = thisWeek ? DateTime.now() : DateTime.now().plus({ week: 1 });
        const title = `The Buffs For ${thisWeek ? "The" : "Next"} Week Shall Be:`;
        this.logger.debug(`Posting ${chalk.blue("week")} message for ${chalk.yellow(date.toISO())}`);
        const filteredWeeks = config.weeks.filter(week => week.isEnabled);
        const week = filteredWeeks[date.get("weekNumber") % filteredWeeks.length];
        await interaction.reply({ embeds: [this.createWeekEmbed(title, week, config.buffs, date)] });
    }
    // Todo: replace all date calculations with unix format.
    async postDailyMessage(client) {
        if (!client.isReady()) {
            await Task.waitTillReady(client);
        }
        this.logger.debug(chalk.cyan("TASK: ") + "Posting daily buff message.");
        const configs = await this.buffManagerConfigRepository.getAll();
        const now = DateTime.now();
        for (const config of configs) {
            try {
                if (!client.guilds.cache.has(config.guildId)) {
                    this.logger.warn(`${chalk.red("Expected Failure:")} There is a ${chalk.blue("config")} listing for the guild with ID ${chalk.yellow(config.guildId)}, which the bot is currently not a member of. Please remove configuration. ${chalk.cyan("Skipping...")}`);
                    continue;
                }
                const guild = await client.guilds.fetch(config.guildId);
                if (!guild) {
                    this.logger.error(`Fetch guild with ID ${chalk.yellow(config.guildId)} returned nothing. ${chalk.cyan("Skipping...")}`);
                    continue;
                }
                const messageSettings = config.messageSettings;
                if (!messageSettings.channelId || !messageSettings.hour)
                    continue;
                if (!now.hasSame(DateTime.fromFormat(messageSettings.hour, "HH:mm"), "minute"))
                    continue;
                if (!config.buffs.length || !config.weeks.length)
                    continue;
                const channel = await guild.channels.fetch(messageSettings.channelId);
                if (!channel?.isText) {
                    this.logger.warn(`Invalid ${chalk.blue("channel")} ${chalk.yellow(messageSettings.channelId)}  ID for ${chalk.yellow(config.guildId)}. ${chalk.cyan("Skipping...")}`);
                    continue;
                }
                const filteredWeeks = config.weeks.filter(week => week.isEnabled);
                const week = filteredWeeks[now.get("weekNumber") % filteredWeeks.length];
                const buffId = Days.toArray(week.days)[now.get("weekday")];
                const buff = config.buffs.find(day => day.id === buffId);
                if (!buff) {
                    this.logger.warn(`Invalid ${chalk.blue("buff")} ID ${chalk.yellow(buffId)} for guild ${chalk.yellow(config.guildId)}. ${chalk.cyan("Skipping...")}`);
                    continue;
                }
                this.logger.debug(`Posting ${chalk.cyan("buff message")}.`);
                await channel.send({ embeds: [this.createBuffEmbed(messageSettings.buffMessage, buff, now)] });
                if (messageSettings.dow !== null && messageSettings.dow === now.weekday - 1) {
                    this.logger.debug(`Posting ${chalk.cyan("week message")}.`);
                    await channel.send({ embeds: [this.createWeekEmbed(messageSettings.weekMessage, week, config.buffs, now)] });
                }
            }
            catch (err) {
                if (err instanceof Error) {
                    this.logger.error(err.stack);
                }
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
    injectable(),
    __metadata("design:paramtypes", [BuffManagerConfigRepository])
], BuffManagerService);
export { BuffManagerService };
//# sourceMappingURL=buffManager.service.js.map