import chalk from "chalk";
import { CommandInteraction, Guild, MessageEmbed, TextChannel } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../shared/logger/logger.decorator.js";
import { Client } from "../shared/models/client.js";
import { Task } from "../shared/models/task.js";
import { BuffManagerRepository } from "./buffManager.repository.js";
import { Buff, BuffManagerConfig, Days, MessageSettings, Week } from "./models/index.js";

@singleton()
export class BuffManagerService {
    private readonly daysOfWeek: string[] = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

    constructor(
        private buffManagerConfigRepository: BuffManagerRepository,
        @createLogger(BuffManagerService.name) private logger: pino.Logger,
    ) {
    }

    public createBuffEmbed(title: string, day: Buff, date: DateTime): MessageEmbed {
        this.logger.debug(`Creating ${chalk.cyan("Buff Embed")}.`);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: day.text,
            thumbnail: { url: day.imageUrl },
            footer: { text: date.toFormat("DDDD") },
        });
    }

    public createWeekEmbed(title: string, week: Week, days: Buff[], date: DateTime): MessageEmbed {
        this.logger.debug(`Creating ${chalk.cyan("Week Embed")}.`);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: week.title,
            fields: Days.toArray(week.days).map((dayId, index) => {
                const dow: string = this.daysOfWeek[index];
                const day: Buff = days.find(entry => entry.id === dayId) ?? { text: "No Buff Found!" } as Buff;

                return { name: dow, value: day.text, inline: true };
            }),
            footer: { text: `Week ${date.get("weekNumber")}.` },
        });
    }

    public async tryGetConfig(interaction: CommandInteraction): Promise<[ BuffManagerConfig, boolean ]> {
        const guildId = interaction.guildId;
        this.logger.debug(`Attempting to acquire ${chalk.blue("configuration")} for guild ${chalk.yellow(guildId)}.`);
        const config: BuffManagerConfig = await this.findOneOrCreate(guildId);

        if (config.buffs.length <= 0) {
            await interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true });
            this.logger.debug(`${chalk.red("Expected Failure:")} No ${chalk.blue("buffs")} were set in config.`);
            return [ null, false ];
        }

        if (config.weeks.filter(week => !("isEnabled" in week) || week.isEnabled).length <= 0) {
            await interaction.reply({ content: "Sorry, there are not enabled weeks set.", ephemeral: true });
            this.logger.debug(`${chalk.red("Expected Failure:")} No ${chalk.blue("weeks")} were set in config.`);
            return [ null, false ];
        }

        this.logger.debug(`${chalk.green("Success:")} Returning results.`);
        return [ config, true ];
    }

    public async postBuff(interaction: CommandInteraction, today = true): Promise<void> {
        const [ config, flag ] = await this.tryGetConfig(interaction);
        if (!flag) {
            return;
        }

        this.logger.debug(`Command invoked for ${chalk.blue("buffs")}.`);

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

        await interaction.reply({ embeds: [ this.createBuffEmbed(title, buff, date) ] });
    }

    public async postWeeksBuffs(interaction: CommandInteraction, thisWeek = true): Promise<void> {
        const [ config, flag ] = await this.tryGetConfig(interaction);
        if (!flag) {
            return;
        }

        this.logger.debug(`Command invoked for ${chalk.blue("weeks")}.`);

        const date = thisWeek ? DateTime.now() : DateTime.now().plus({ week: 1 });
        const title = `The Buffs For ${thisWeek ? "The" : "Next"} Week Shall Be:`;

        this.logger.debug(`Posting ${chalk.blue("week")} message for ${chalk.yellow(date.toISO())}`);
        const filteredWeeks = config.weeks.filter(week => week.isEnabled);
        const week = filteredWeeks[date.get("weekNumber") % filteredWeeks.length];
        await interaction.reply({
            embeds: [ this.createWeekEmbed(title, week, config.buffs, date) ],
        });
    }

    public async postDailyMessage(client: Client): Promise<void> {
        if (!client.isReady()) {
            await Task.waitTillReady(client);
        }
        this.logger.debug(chalk.cyan("TASK: ") + "Posting daily buff message.");

        const configs: BuffManagerConfig[] = await this.buffManagerConfigRepository.getAll();
        const now: DateTime = DateTime.now();

        for (const config of configs) {
            try {
                if (!client.guilds.cache.has(config.guildId)) {
                    this.logger.warn(`${chalk.red("Expected Failure:")} There is a ${chalk.blue("config")} listing for the guild with ID ${chalk.yellow(config.guildId)}, which the bot is currently not a member of. Please remove configuration. ${chalk.cyan("Skipping...")}`);
                    continue;
                }

                const guild: Guild | null = await client.guilds.fetch(config.guildId);
                if (!guild) {
                    this.logger.error(`Fetch guild with ID ${chalk.yellow(config.guildId)} returned nothing. ${chalk.cyan("Skipping...")}`);
                    continue;
                }

                const messageSettings: MessageSettings = config.messageSettings as MessageSettings;
                if (!messageSettings.channelId || !messageSettings.hour) continue;
                if (!now.hasSame(DateTime.fromFormat(messageSettings.hour, "HH:mm"), "minute")) continue;
                if (!config.buffs.length || !config.weeks.length) continue;

                const channel: TextChannel | null = await guild.channels.fetch(messageSettings.channelId) as TextChannel | null;
                if (!channel?.isText) {
                    this.logger.warn(`Invalid ${chalk.blue("channel")} ${chalk.yellow(messageSettings.channelId)}  ID for ${chalk.yellow(config.guildId)}. ${chalk.cyan("Skipping...")}`);
                    continue;
                }

                const filteredWeeks = config.weeks.filter(week => week.isEnabled);
                const week: Week = filteredWeeks[now.get("weekNumber") % filteredWeeks.length];
                const buffId: string = Days.toArray(week.days)[now.get("weekday")];
                const buff: Buff = config.buffs.find(day => day.id === buffId);

                if (!buff) {
                    this.logger.warn(`Invalid ${chalk.blue("buff")} ID ${chalk.yellow(buffId)} for guild ${chalk.yellow(config.guildId)}. ${chalk.cyan("Skipping...")}`);
                    continue;
                }

                this.logger.debug(`Posting ${chalk.cyan("buff message")}.`);
                await channel.send({ embeds: [ this.createBuffEmbed(messageSettings.buffMessage, buff, now) ] });

                if (messageSettings.dow !== null && messageSettings.dow === now.weekday - 1) {
                    this.logger.debug(`Posting ${chalk.cyan("week message")}.`);
                    await channel.send({
                        embeds: [ this.createWeekEmbed(messageSettings.weekMessage, week, config.buffs, now) ],
                    });
                }
            } catch (err) {
                if (err instanceof Error) {
                    this.logger.error(err.stack);
                }
            }
        }
    }

    private async findOneOrCreate(id: string): Promise<BuffManagerConfig> {
        let result = await this.buffManagerConfigRepository.findOne({ guildId: id });
        if (result) return result;

        result = new BuffManagerConfig();
        result.guildId = id;

        return await this.buffManagerConfigRepository.save(result);
    }
}
