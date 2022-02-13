import {ModuleBase} from "../classes/moduleBase.js";
import dayjs from "dayjs";
import {BuffManagerConfig, Buff, MessageSettings, Week} from "../models/buffManager.model.js";
import {CommandInteraction, Guild, MessageEmbed, TextChannel} from "discord.js";
import {DaysToArray} from "../utils/utils.js";
import {Client} from "../classes/client.js";
import {Task} from "../classes/task.js";
import {BuffManagerConfigService} from "../services/buffManagerConfigService.js";
import {logger} from "../utils/logger.js";
import chalk from "chalk";

export class BuffManagerModule extends ModuleBase {
    private static readonly loggerMeta = {context: "BuffManagerModule"};
    private static readonly daysOfWeek: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    private service: BuffManagerConfigService;

    constructor() {
        super();
        this.service = new BuffManagerConfigService();

        this._moduleName = "BuffManager";
        this._commands = [
            {
                command: builder => builder.setName("todays_buff").setDescription("Displays the buff for the day."),
                run: async interaction => this.postBuff(interaction, dayjs(), "Today's Buff Shall Be:")
            },
            {
                command: builder => builder.setName("tomorrows_buff").setDescription("Displays the buff for tomorrow."),
                run: async interaction => this.postBuff(interaction, dayjs().add(1, "day"), "Tomorrow's Buff Shall Be:")
            },
            {
                command: builder => builder.setName("this_weeks_buffs").setDescription("Displays the buffs for the week"),
                run: async interaction => this.postWeeksBuffs(interaction, dayjs(), "The Buffs For The Week Shall Be:")
            },
            {
                command: builder => builder.setName("next_weeks_buffs").setDescription("Displays the buffs for next week"),
                run: async interaction => this.postWeeksBuffs(interaction, dayjs().add(1, "week"), "The Buffs For Next Week Shall Be:")
            }
        ];
        this._tasks = [
            {
                name: `${this.moduleName}#dailyMessageTask`,
                timeout: 60000,
                run: async client => this.postDailyMessage(client)
            }
        ];
    }

    private static createBuffEmbed(title: string, day: Buff, date: dayjs.Dayjs): MessageEmbed {
        logger.debug("Creating Buff Embed.", this.loggerMeta);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: day.text,
            thumbnail: {url: day.imageUrl},
            footer: {text: date.format("dddd Do MMMM YYYY")}
        });
    }

    private static createWeekEmbed(title: string, week: Week, days: Buff[], date: dayjs.Dayjs): MessageEmbed {
        logger.debug("Creating Week Embed.", this.loggerMeta);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: week.title,
            fields: week.days.toArray.map((dayId, index) => {
                const dow: string = this.daysOfWeek[index];
                const day: Buff = days.find(entry => entry.id === dayId) ?? {text: "No Buff Found"} as Buff

                return {name: dow, value: day.text, inline: true};
            }),
            footer: {text: `Week ${date.week()}.`}
        });
    }

    private async tryGetConfig(interaction: CommandInteraction, guildId: string): Promise<[BuffManagerConfig, boolean]> {
        logger.debug(`Attempting to acquire configuration for guild ${chalk.yellow(guildId)}`, BuffManagerModule.loggerMeta);
        const config: BuffManagerConfig = await this.service.findOneOrCreate(guildId);

        if (config.buffs.length <= 0) {
            await interaction.reply({content: "Sorry, there are not buffs set.", ephemeral: true});
            logger.debug(`Expected Failure. No buffs were set in config.`, BuffManagerModule.loggerMeta);
            return [null, false];
        }

        if (config.weeks.filter(week => !('isEnabled' in week) || week.isEnabled).length <= 0) {
            await interaction.reply({content: "Sorry, there are not enabled weeks set.", ephemeral: true});
            logger.debug(`Expected Failure. No weeks were set in config.`, BuffManagerModule.loggerMeta);
            return [null, false];
        }

        logger.debug(`Success. Returning results.`, BuffManagerModule.loggerMeta);
        return [config, true];
    }

    private async postBuff(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
        logger.debug(`Posting buff message for ${date}`, BuffManagerModule.loggerMeta);
        if (!interaction.guildId) {
            await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
            return;
        }

        const [config, flag]: [BuffManagerConfig, boolean] = await this.tryGetConfig(interaction, interaction.guildId);
        if (!flag) return;

        const week = config.weeks[date.week() % config.weeks.length];
        const day = config.buffs.find(day => day.id === week.days.toArray[date.day()]);

        if (!day) {
            await interaction.reply({
                content: `Sorry, but the buff with id **${week.days[date.day()]}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
                ephemeral: true
            });
            return;
        }

        await interaction.reply({embeds: [BuffManagerModule.createBuffEmbed(title, day, date)]});
    }

    private async postWeeksBuffs(interaction: CommandInteraction, date: dayjs.Dayjs, title: string): Promise<void> {
        logger.debug(`Posting week message for ${date}`, BuffManagerModule.loggerMeta);
        if (!interaction.guildId) {
            await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
            return;
        }

        const [config, flag]: [BuffManagerConfig, boolean] = await this.tryGetConfig(interaction, interaction.guildId);
        if (!flag) return;

        const filteredWeeks = config.weeks.filter(week => week.isEnabled);
        const week = filteredWeeks[date.week() % filteredWeeks.length];
        await interaction.reply({embeds: [BuffManagerModule.createWeekEmbed(title, week, config.buffs, date)]});
    }

    private async postDailyMessage(client: Client): Promise<void> {
        logger.debug("Posting daily message task.", BuffManagerModule.loggerMeta);
        await Task.waitTillReady(client);

        const configs: BuffManagerConfig[] = await this.service.getAll();
        const now: dayjs.Dayjs = dayjs();

        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId)) continue;
            const guild: Guild | null = await client.guilds.fetch(config.guildId);
            if (!guild) continue;
            try {
                const messageSettings: MessageSettings = config.messageSettings as MessageSettings;
                if (!messageSettings.channelId || !messageSettings.hour) continue;
                if (!now.isSame(dayjs(messageSettings.hour, "HH:mm", true), "minute")) continue;
                if (!config.buffs.length || !config.weeks.length) continue;

                const channel: TextChannel | null = await guild.channels.fetch(messageSettings.channelId) as TextChannel | null;

                if (!channel) {
                    logger.info(`Invalid posting channel for ${config.guildId}`, BuffManagerModule.loggerMeta);
                    continue;
                }

                const filteredWeeks = config.weeks.filter(week => week.isEnabled);
                const week: Week = filteredWeeks[now.week() % filteredWeeks.length];
                const day: Buff = config.buffs.find(day => day.id === DaysToArray(week.days)[now.day()]);

                if (!day) {
                    logger.info(`Invalid day id for guild ${config.guildId}`, BuffManagerModule.loggerMeta);
                    continue;
                }

                await channel.send({embeds: [BuffManagerModule.createBuffEmbed(messageSettings.buffMessage, day, now)]});


                if (messageSettings.dow && messageSettings.dow === now.day()) {
                    await channel.send({embeds: [BuffManagerModule.createWeekEmbed(messageSettings.weekMessage, week, config.buffs, now)]});
                }
            } catch (err) {
                logger.error(err, BuffManagerModule.loggerMeta);
            }
        }
    }
}