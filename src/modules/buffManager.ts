import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {CommandInteraction, MessageEmbed, TextChannel} from "discord.js";
import Client from "../classes/Client";
import Model, {BuffManagerConfig, Day, MessageSettings, Week} from "../objects/BuffManager";
import {Module} from "../classes/Module";
import {SlashCommandBuilder} from "@discordjs/builders";
import Command from "../classes/Command";
import Task from "../classes/Task";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

class BuffManager extends Module {
    static weekDays: Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    constructor() {
        super("BuffManager");

        this.commands = [
            new Command(new SlashCommandBuilder()
                    .setName("next_weeks_buff")
                    .setDescription("Displays the buffs for next week"),
                async interaction => await BuffManager.postWeeksBuffs(interaction, dayjs().add(1, "week"), "The Buffs For Next Week Shall Be:")),
            new Command(new SlashCommandBuilder()
                    .setName("today_buff")
                    .setDescription("Displays the buff for the day."),
                async interaction => await BuffManager.postBuff(interaction, dayjs(), "Today's Buff Shall Be:")),
            new Command(new SlashCommandBuilder()
                    .setName("tomorrows_buff")
                    .setDescription("Displays the buff for tomorrow."),
                async interaction => await BuffManager.postBuff(interaction, dayjs().add(1, "day"), "Tomorrow's Buff Shall Be:")
            ),
            new Command(new SlashCommandBuilder()
                    .setName("this_weeks_buff")
                    .setDescription("Displays the buffs for the week"),
                async interaction => await BuffManager.postWeeksBuffs(interaction, dayjs(), "The Buffs For The Week Shall Be:"))
        ];

        this.tasks = [
            new Task("buffManager_dailyMessage_Loop", 60000, async client => {
                await Task.waitTillReady(client);
                await BuffManager.postDailyMessage(client);
            })
        ];
    }

    static createDayEmbed(title: string, day: Day, date: dayjs.Dayjs): MessageEmbed {
        return new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(title)
            .setDescription(day.text)
            .setThumbnail(day.imageUrl)
            .setFooter(date.format("dddd Do MMMM YYYY"));
    }

    static createWeekEmbed(title: string, week: Week, days: Day[], date: dayjs.Dayjs): MessageEmbed {
        const _days = week.days.map((dayId, index) => {
            const dow: string = this.weekDays[index];
            const day: Day = days.find(entry => entry.id === dayId) || new Day("No Buff Found", "")

            return {name: dow, value: day.text, inline: true};
        });

        return new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(title)
            .setDescription(week.title)
            .addFields(_days)
            .setFooter(`Week ${date.week()}.`);

    }

    static async tryGetConfig(interaction: CommandInteraction, guildId: string): Promise<[BuffManagerConfig | null, boolean]> {
        const config: BuffManagerConfig = await Model.findOne({guildId: guildId}) ?? await Model.create({guildId: guildId});

        if (!config.days.length) {
            await interaction.reply({content: "Sorry, there are not buffs set.", ephemeral: true});
            return [null, false];
        }

        if (!config.weeks.length) {
            await interaction.reply({content: "Sorry, there are not weeks set.", ephemeral: true});
            return [null, false];
        }

        return [config, true];
    }

    static async postBuff(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
        if (!interaction.guildId) {
            await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
            return;
        }

        const [config, flag]: [BuffManagerConfig | null, boolean] = await this.tryGetConfig(interaction, interaction.guildId);
        if (!flag) return;

        const week = config.weeks[date.week() % config.weeks.length];
        const day = config.days.find(day => day.id === week.days[date.day()]);

        if (!day) {
            await interaction.reply({
                content: `Sorry, but the buff with id **${week.days[date.day()]}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
                ephemeral: true
            });
            return;
        }

        await interaction.reply({embeds: [this.createDayEmbed(title, day, date)]});
    }

    static async postWeeksBuffs(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
        if (!interaction.guildId) {
            await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
            return;
        }

        const [config, flag]: [BuffManagerConfig | null, boolean] = await this.tryGetConfig(interaction, interaction.guildId);
        if (!flag) return;

        const week = config.weeks[date.week() % config.weeks.length];
        await interaction.reply({embeds: [this.createWeekEmbed(title, week, config.days, date)]});
    }

    static async postDailyMessage(client: Client) {
        const configs: BuffManagerConfig[] = await Model.find({});
        const now: dayjs.Dayjs = dayjs();

        for (const guildConfig of configs) {
            if(!client.guilds.cache.has(guildConfig.guildId)) continue;
            try {
                const config: MessageSettings = guildConfig.messageSettings as MessageSettings;
                if (!config.channelId || !config.hour) continue;
                if (!now.isSame(dayjs(config.hour, "HH:mm", true), "minute")) continue;
                if (!guildConfig.days.length || !guildConfig.weeks.length) continue;

                const channel: TextChannel | null = await client.channels.fetch(config.channelId) as TextChannel | null;

                if (!channel) {
                    console.warn(`Invalid posting channel for ${guildConfig.guildId}`);
                    continue;
                }

                const week: Week = guildConfig.weeks[now.week() % guildConfig.weeks.length];
                const day: Day | undefined = guildConfig.days.find(day => day.id === week.days[now.day()]);

                if (!day) {
                    console.warn(`Invalid day id for guild ${guildConfig.guildId}`);
                    continue;
                }

                await channel.send({embeds: [this.createDayEmbed(config.buffMessage, day, now)]});


                if (config.dow && config.dow === now.day())
                    await channel.send({embeds: [this.createWeekEmbed(config.weekMessage, week, guildConfig.days, now)]});
            } catch (error) {
                console.log(error);
            }
        }
    }
}

export default new BuffManager();
