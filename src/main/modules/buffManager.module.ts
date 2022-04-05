import chalk from "chalk";
import dayjs from "dayjs";
import { CommandInteraction, Guild, MessageEmbed, TextChannel } from "discord.js";
import { Error } from "memfs/lib/internal/errors.js";
import { injectable } from "tsyringe";

import { Client } from "../classes/client.js";
import { ModuleBase } from "../classes/moduleBase.js";
import { Task } from "../classes/task.js";
import { Buff, BuffManagerConfig, MessageSettings, Week } from "../models/buffManager.model.js";
import { BuffManagerConfigService } from "../services/buffManagerConfig.service.js";
import { logger } from "../utils/logger.js";

@injectable()
export class BuffManagerModule extends ModuleBase {
    private readonly loggerMeta = { context: "BuffManagerModule" };
    private readonly daysOfWeek: string[] = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

    constructor(private service: BuffManagerConfigService) {
        super();

        this.moduleName = "BuffManager";
        this.commands = [
            {
                command: builder =>
                    builder
                        .setName("buff_manager")
                        .setDescription("Manages all things related to buffs")
                        .addSubcommandGroup(subGroup =>
                            subGroup
                                .setName("buffs")
                                .setDescription("Shows you what buffs are set.")
                                .addSubcommand(subBuilder => subBuilder.setName("today").setDescription("Gets today's buff."))
                                .addSubcommand(subBuilder => subBuilder.setName("tomorrow").setDescription("Gets tomorrow's buff.")),
                        )
                        .addSubcommandGroup(subGroup =>
                            subGroup
                                .setName("weeks")
                                .setDescription("Shows you what buffs for the week, are set to.")
                                .addSubcommand(subBuilder => subBuilder.setName("this_week").setDescription("Gets this week's buffs."))
                                .addSubcommand(subBuilder => subBuilder.setName("next_week").setDescription("Gets next week's buffs")),
                        ),
                run: async interaction => this.subCommandManager(interaction),
            },
        ];
        this.tasks = [
            {
                name: `${this.moduleName}#dailyMessageTask`,
                timeout: 60000,
                run: async client => this.postDailyMessage(client),
            },
        ];
    }

    private async subCommandManager(interaction: CommandInteraction): Promise<void> {
        logger.debug(`${chalk.cyan("Command invoked")}, dealing with subcommand options.`, this.loggerMeta);

        const group = interaction.options.getSubcommandGroup();
        const subCommand = interaction.options.getSubcommand();
        if (!(subCommand && group)) {
            logger.debug(`${chalk.red("Expected Failure:")} no ${chalk.blue("subcommand")} or ${chalk.blue("group")} was used.`, this.loggerMeta);
            return interaction.reply({
                content: "Sorry you can only use the group or subcommands not the main command.",
                ephemeral: true,
            });
        }

        if (!interaction.guildId) {
            logger.debug(`${chalk.red("Expected Failure:")} Command was attempted to be invoked inside of a direct message.`, this.loggerMeta);
            return interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        }

        const [ config, flag ]: [ BuffManagerConfig, boolean ] = await this.tryGetConfig(interaction, interaction.guildId);
        if (!flag) return;

        if (group === "buffs") {
            return this.postBuff(interaction, subCommand, config);
        } else {
            return this.postWeeksBuffs(interaction, subCommand, config);
        }
    }

    private createBuffEmbed(title: string, day: Buff, date: dayjs.Dayjs): MessageEmbed {
        logger.debug(`Creating ${chalk.cyan("Buff Embed")}.`, this.loggerMeta);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: day.text,
            thumbnail: { url: day.imageUrl },
            footer: { text: date.format("dddd Do MMMM YYYY") },
        });
    }

    private createWeekEmbed(title: string, week: Week, days: Buff[], date: dayjs.Dayjs): MessageEmbed {
        logger.debug(`Creating ${chalk.cyan("Week Embed")}.`, this.loggerMeta);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: week.title,
            fields: week.days.toArray.map((dayId, index) => {
                const dow: string = this.daysOfWeek[index];
                const day: Buff = days.find(entry => entry.id === dayId) ?? { text: "No Buff Found!" } as Buff;

                return { name: dow, value: day.text, inline: true };
            }),
            footer: { text: `Week ${date.week()}.` },
        });
    }

    private async tryGetConfig(interaction: CommandInteraction, guildId: string): Promise<[ BuffManagerConfig, boolean ]> {
        logger.debug(`Attempting to acquire ${chalk.blue("configuration")} for guild ${chalk.yellow(guildId)}.`, this.loggerMeta);
        const config: BuffManagerConfig = await this.service.findOneOrCreate(guildId);

        if (config.buffs.length <= 0) {
            await interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true });
            logger.debug(`${chalk.red("Expected Failure:")} No ${chalk.blue("buffs")} were set in config.`, this.loggerMeta);
            return [ null, false ];
        }

        if (config.weeks.filter(week => !("isEnabled" in week) || week.isEnabled).length <= 0) {
            await interaction.reply({ content: "Sorry, there are not enabled weeks set.", ephemeral: true });
            logger.debug(`${chalk.red("Expected Failure:")} No ${chalk.blue("weeks")} were set in config.`, this.loggerMeta);
            return [ null, false ];
        }

        logger.debug(`${chalk.green("Success:")} Returning results.`, this.loggerMeta);
        return [ config, true ];
    }

    private async postBuff(interaction: CommandInteraction, subCommand: string, config: BuffManagerConfig): Promise<void> {
        logger.debug(`Command invoked for ${chalk.blue("buffs")}.`);

        const today = subCommand === "today";
        const date = today ? dayjs() : dayjs().add(1, "day");
        const title = `${today ? "Today's" : "Tomorrow's"} Buff Shall Be:`;

        logger.debug(`Posting ${chalk.blue("buff")} message for the date ${chalk.yellow(date.format())}`, this.loggerMeta);
        const week = config.weeks[date.week() % config.weeks.length];
        const buffId = week.days.toArray[date.day()];
        const buff = config.buffs.find(day => day.id === buffId);

        if (!buff) {
            await interaction.reply({
                content: `Sorry, but the buff with id **${buffId}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
                ephemeral: true,
            });
            logger.debug(`${chalk.red("Expected Failure:")} ${chalk.blue("Buff")} with id ${chalk.yellow(buffId)} does not exist.`, this.loggerMeta);
            return;
        }

        await interaction.reply({ embeds: [ this.createBuffEmbed(title, buff, date) ] });
    }

    private async postWeeksBuffs(interaction: CommandInteraction, subCommand: string, config: BuffManagerConfig): Promise<void> {
        logger.debug(`Command invoked for ${chalk.blue("weeks")}.`);

        const thisWeek = subCommand === "this_week";
        const date = thisWeek ? dayjs() : dayjs().add(1, "week");
        const title = `The Buffs For ${thisWeek ? "The" : "Next"} Week Shall Be:`;

        logger.debug(`Posting ${chalk.blue("week")} message for ${chalk.yellow(date.format())}`, this.loggerMeta);
        const filteredWeeks = config.weeks.filter(week => week.isEnabled);
        const week = filteredWeeks[date.week() % filteredWeeks.length];
        await interaction.reply({ embeds: [ this.createWeekEmbed(title, week, config.buffs, date) ] });
    }

    private async postDailyMessage(client: Client): Promise<void> {
        if (!client.isReady()) {
            await Task.waitTillReady(client);
        }
        logger.debug(chalk.cyan("TASK: ") + "Posting daily buff message.", this.loggerMeta);

        const configs: BuffManagerConfig[] = await this.service.getAll();
        const now: dayjs.Dayjs = dayjs();

        for (const config of configs) {
            try {
                if (!client.guilds.cache.has(config.guildId)) {
                    logger.warn(`${chalk.red("Expected Failure:")} There is a ${chalk.blue("config")} listing for the guild with ID ${chalk.yellow(config.guildId)}, which the bot is currently not a member of. Please remove configuration. ${chalk.cyan("Skipping...")}`, this.loggerMeta);
                    continue;
                }

                const guild: Guild | null = await client.guilds.fetch(config.guildId);
                if (!guild) {
                    logger.error(`Fetch guild with ID ${chalk.yellow(config.guildId)} returned nothing. ${chalk.cyan("Skipping...")}`, this.loggerMeta);
                    continue;
                }

                const messageSettings: MessageSettings = config.messageSettings as MessageSettings;
                if (!messageSettings.channelId || !messageSettings.hour) continue;
                if (!now.isSame(dayjs(messageSettings.hour, "HH:mm", true), "minute")) continue;
                if (!config.buffs.length || !config.weeks.length) continue;

                const channel: TextChannel | null = await guild.channels.fetch(messageSettings.channelId) as TextChannel | null;
                if (!channel?.isText) {
                    logger.warn(`Invalid ${chalk.blue("channel")} ${chalk.yellow(messageSettings.channelId)}  ID for ${chalk.yellow(config.guildId)}. ${chalk.cyan("Skipping...")}`, this.loggerMeta);
                    continue;
                }

                const filteredWeeks = config.weeks.filter(week => week.isEnabled);
                const week: Week = filteredWeeks[now.week() % filteredWeeks.length];
                const buffId: string = week.days.toArray[now.day()];
                const buff: Buff = config.buffs.find(day => day.id === buffId);

                if (!buff) {
                    logger.warn(`Invalid ${chalk.blue("buff")} ID ${chalk.yellow(buffId)} for guild ${chalk.yellow(config.guildId)}. ${chalk.cyan("Skipping...")}`, this.loggerMeta);
                    continue;
                }

                logger.debug(`Posting ${chalk.cyan("buff message")}.`, this.loggerMeta);
                await channel.send({ embeds: [ this.createBuffEmbed(messageSettings.buffMessage, buff, now) ] });

                if (messageSettings.dow !== null && messageSettings.dow === now.day()) {
                    logger.debug(`Posting ${chalk.cyan("week message")}.`, this.loggerMeta);
                    await channel.send({ embeds: [ this.createWeekEmbed(messageSettings.weekMessage, week, config.buffs, now) ] });
                }
            } catch (err) {
                if (err instanceof Error) {
                    logger.error(err.stack, this.loggerMeta);
                }
            }
        }
    }
}
