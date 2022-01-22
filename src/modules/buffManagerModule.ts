import {ModuleBase} from "../classes/moduleBase";
import {SlashCommandBuilder} from "@discordjs/builders";
import dayjs from "dayjs";
import {BuffManagerConfig, Day, MessageSettings, Week} from "../models/buffManager";
import {CommandInteraction, Guild, MessageEmbed, TextChannel} from "discord.js";
import {DaysToArray} from "../utils";
import {Client} from "../classes/client";
import {Task} from "../classes/task";
import {BuffManagerConfigService} from "../services/buffManagerConfigService";

export class BuffManagerModule extends ModuleBase {
    private service: BuffManagerConfigService;

    constructor() {
        super();
        this._moduleName = "BuffManager";
        this.service = new BuffManagerConfigService();

        this._commands = [
            {
                command: new SlashCommandBuilder().setName("todays_buff").setDescription("Displays the buff for the day."),
                run: async interaction => await this.postBuff(interaction, dayjs(), "Today's Buff Shall Be:")
            },
            {
                command: new SlashCommandBuilder().setName("tomorrows_buff").setDescription("Displays the buff for tomorrow."),
                run: async interaction => await this.postBuff(interaction, dayjs().add(1, "day"), "Tomorrow's Buff Shall Be:")
            },
            {
                command: new SlashCommandBuilder().setName("this_weeks_buff").setDescription("Displays the buffs for the week"),
                run: async interaction => await this.postWeeksBuffs(interaction, dayjs(), "The Buffs For The Week Shall Be:")
            },
            {
                command: new SlashCommandBuilder().setName("next_weeks_buff").setDescription("Displays the buffs for next week"),
                run: async interaction => await this.postWeeksBuffs(interaction, dayjs().add(1, "week"), "The Buffs For Next Week Shall Be:")
            }];

        this._tasks = [
            {
                name: "buffManager_dailyMessage_Loop",
                timeout: 60000,
                run: async client => {
                    await Task.waitTillReady(client);
                    await this.postDailyMessage(client);
                }
            }
        ];
    }

    private static createDayEmbed(title: string, day: Day, date: dayjs.Dayjs): MessageEmbed {
        return new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(title)
            .setDescription(day.text)
            .setThumbnail(day.imageUrl)
            .setFooter({text: date.format("dddd Do MMMM YYYY")});
    }

    private static createWeekEmbed(title: string, week: Week, days: Day[], date: dayjs.Dayjs): MessageEmbed {
        const _days = DaysToArray(week.days).map((dayId, index) => {
            const dow: string = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index];
            const day: Day = days.find(entry => entry.id === dayId) ?? {text: "No Buff Found"} as Day

            return {name: dow, value: day.text, inline: true};
        });

        return new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(title)
            .setDescription(week.title)
            .addFields(_days)
            .setFooter({text: `Week ${date.week()}.`});
    }

    private async tryGetConfig(interaction: CommandInteraction, guildId: string): Promise<[BuffManagerConfig | null, boolean]> {
        const config: BuffManagerConfig = await this.service.findOneOrCreate(guildId);

        if (config.days.length <= 0) {
            await interaction.reply({content: "Sorry, there are not buffs set.", ephemeral: true});
            return [null, false];
        }

        if (config.weeks.length <= 0) {
            await interaction.reply({content: "Sorry, there are not weeks set.", ephemeral: true});
            return [null, false];
        }

        return [config, true];
    }

    private async postBuff(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
        if (!interaction.guildId) {
            await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
            return;
        }

        const [config, flag]: [BuffManagerConfig | null, boolean] = await this.tryGetConfig(interaction, interaction.guildId);
        if (!flag) return;

        const week = config.weeks[date.week() % config.weeks.length];
        const day = config.days.find(day => day.id === DaysToArray(week.days)[date.day()]);

        if (!day) {
            await interaction.reply({
                content: `Sorry, but the buff with id **${week.days[date.day()]}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
                ephemeral: true
            });
            return;
        }

        await interaction.reply({embeds: [BuffManagerModule.createDayEmbed(title, day, date)]});
    }

    private async postWeeksBuffs(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
        if (!interaction.guildId) {
            await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
            return;
        }

        const [config, flag]: [BuffManagerConfig | null, boolean] = await this.tryGetConfig(interaction, interaction.guildId);
        if (!flag) return;

        const week = config.weeks[date.week() % config.weeks.length];
        await interaction.reply({embeds: [BuffManagerModule.createWeekEmbed(title, week, config.days, date)]});
    }

    private async postDailyMessage(client: Client) {
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
                if (!config.days.length || !config.weeks.length) continue;

                const channel: TextChannel | null = await guild.channels.fetch(messageSettings.channelId) as TextChannel | null;

                if (!channel) {
                    console.warn(`Invalid posting channel for ${config.guildId}`);
                    continue;
                }

                const week: Week = config.weeks[now.week() % config.weeks.length];
                const day: Day | undefined = config.days.find(day => day.id === DaysToArray(week.days)[now.day()]);

                if (!day) {
                    console.warn(`Invalid day id for guild ${config.guildId}`);
                    continue;
                }

                await channel.send({embeds: [BuffManagerModule.createDayEmbed(messageSettings.buffMessage, day, now)]});


                if (messageSettings.dow && messageSettings.dow === now.day())
                    await channel.send({embeds: [BuffManagerModule.createWeekEmbed(messageSettings.weekMessage, week, config.days, now)]});
            } catch (error) {
                console.log(error);
            }
        }
    }
}