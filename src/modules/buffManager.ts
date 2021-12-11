import dayjs from "dayjs";
import {CommandInteraction, Guild, MessageEmbed, TextChannel} from "discord.js";
import Client from "../classes/Client";
import {BuffManagerConfig, Day, MessageSettings, Week} from "../objects/BuffManager";
import Model from "../models/BuffManager";
import {Module} from "../classes/Module";
import {SlashCommandBuilder} from "@discordjs/builders";
import Command from "../classes/Command";
import Task from "../classes/Task";
import {DaysToArray} from "../utils";

function createDayEmbed(title: string, day: Day, date: dayjs.Dayjs): MessageEmbed {
    return new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(title)
        .setDescription(day.text)
        .setThumbnail(day.imageUrl)
        .setFooter(date.format("dddd Do MMMM YYYY"));
}

function createWeekEmbed(title: string, week: Week, days: Day[], date: dayjs.Dayjs): MessageEmbed {
    const _days = DaysToArray(week.days).map((dayId, index) => {
        const dow: string = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index];
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

async function tryGetConfig(interaction: CommandInteraction, guildId: string): Promise<[BuffManagerConfig | null, boolean]> {
    const config: BuffManagerConfig = await Model.findOne({_id: guildId}) ?? await Model.create({_id: guildId});

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

async function postBuff(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
    if (!interaction.guildId) {
        await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        return;
    }

    const [config, flag]: [BuffManagerConfig | null, boolean] = await tryGetConfig(interaction, interaction.guildId);
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

    await interaction.reply({embeds: [createDayEmbed(title, day, date)]});
}

async function postWeeksBuffs(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
    if (!interaction.guildId) {
        await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        return;
    }

    const [config, flag]: [BuffManagerConfig | null, boolean] = await tryGetConfig(interaction, interaction.guildId);
    if (!flag) return;

    const week = config.weeks[date.week() % config.weeks.length];
    await interaction.reply({embeds: [createWeekEmbed(title, week, config.days, date)]});
}

async function postDailyMessage(client: Client) {
    const configs: BuffManagerConfig[] = await Model.find({});
    const now: dayjs.Dayjs = dayjs();

    for (const guildConfig of configs) {
        if (!client.guilds.cache.has(guildConfig._id)) continue;
        try {
            const config: MessageSettings = guildConfig.messageSettings as MessageSettings;
            if (!config.channelId || !config.hour) continue;
            if (!now.isSame(dayjs(config.hour, "HH:mm", true), "minute")) continue;
            if (!guildConfig.days.length || !guildConfig.weeks.length) continue;

            const guild: Guild | null = await client.guilds.fetch(guildConfig._id);
            if (!guild) return;
            if (!guild.channels.cache.has(config.channelId)) return;

            const channel: TextChannel | null = await guild.channels.fetch(config.channelId) as TextChannel | null;

            if (!channel) {
                console.warn(`Invalid posting channel for ${guildConfig._id}`);
                continue;
            }

            const week: Week = guildConfig.weeks[now.week() % guildConfig.weeks.length];
            const day: Day | undefined = guildConfig.days.find(day => day.id === DaysToArray(week.days)[now.day()]);

            if (!day) {
                console.warn(`Invalid day id for guild ${guildConfig._id}`);
                continue;
            }

            await channel.send({embeds: [createDayEmbed(config.buffMessage, day, now)]});


            if (config.dow && config.dow === now.day())
                await channel.send({embeds: [createWeekEmbed(config.weekMessage, week, guildConfig.days, now)]});
        } catch (error) {
            console.log(error);
        }
    }
}

class BuffManager extends Module {
    constructor() {
        super("BuffManager");

        this.commands = [
            new Command(new SlashCommandBuilder()
                    .setName("todays_buff")
                    .setDescription("Displays the buff for the day."),
                async interaction => await postBuff(interaction, dayjs(), "Today's Buff Shall Be:")),
            new Command(new SlashCommandBuilder()
                    .setName("tomorrows_buff")
                    .setDescription("Displays the buff for tomorrow."),
                async interaction => await postBuff(interaction, dayjs().add(1, "day"), "Tomorrow's Buff Shall Be:")
            ),
            new Command(new SlashCommandBuilder()
                    .setName("this_weeks_buff")
                    .setDescription("Displays the buffs for the week"),
                async interaction => await postWeeksBuffs(interaction, dayjs(), "The Buffs For The Week Shall Be:")),
            new Command(new SlashCommandBuilder()
                    .setName("next_weeks_buff")
                    .setDescription("Displays the buffs for next week"),
                async interaction => await postWeeksBuffs(interaction, dayjs().add(1, "week"), "The Buffs For Next Week Shall Be:"))
        ];

        this.tasks = [
            new Task("buffManager_dailyMessage_Loop", 60000, async client => {
                await Task.waitTillReady(client);
                await postDailyMessage(client);
            })
        ];
    }
}

export default new BuffManager();
export {createDayEmbed, createWeekEmbed, postBuff, postWeeksBuffs, postDailyMessage};
