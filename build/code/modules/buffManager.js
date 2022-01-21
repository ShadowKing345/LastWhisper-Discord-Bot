"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDailyMessage = exports.postWeeksBuffs = exports.postBuff = exports.createWeekEmbed = exports.createDayEmbed = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const discord_js_1 = require("discord.js");
const BuffManager_1 = require("../objects/BuffManager");
const BuffManager_2 = __importDefault(require("../schema/BuffManager"));
const Module_1 = require("../classes/Module");
const builders_1 = require("@discordjs/builders");
const Command_1 = __importDefault(require("../classes/Command"));
const Task_1 = __importDefault(require("../classes/Task"));
const utils_1 = require("../utils");
function createDayEmbed(title, day, date) {
    return new discord_js_1.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(title)
        .setDescription(day.text)
        .setThumbnail(day.imageUrl)
        .setFooter(date.format("dddd Do MMMM YYYY"));
}
exports.createDayEmbed = createDayEmbed;
function createWeekEmbed(title, week, days, date) {
    const _days = (0, utils_1.DaysToArray)(week.days).map((dayId, index) => {
        const dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index];
        const day = days.find(entry => entry.id === dayId) || new BuffManager_1.Day("No Buff Found", "");
        return { name: dow, value: day.text, inline: true };
    });
    return new discord_js_1.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(title)
        .setDescription(week.title)
        .addFields(_days)
        .setFooter(`Week ${date.week()}.`);
}
exports.createWeekEmbed = createWeekEmbed;
async function tryGetConfig(interaction, guildId) {
    const config = await BuffManager_2.default.findOne({ _id: guildId }) ?? await BuffManager_2.default.create({ _id: guildId });
    if (config.days.length <= 0) {
        await interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true });
        return [null, false];
    }
    if (config.weeks.length <= 0) {
        await interaction.reply({ content: "Sorry, there are not weeks set.", ephemeral: true });
        return [null, false];
    }
    return [config, true];
}
async function postBuff(interaction, date, title) {
    if (!interaction.guildId) {
        await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        return;
    }
    const [config, flag] = await tryGetConfig(interaction, interaction.guildId);
    if (!flag)
        return;
    const week = config.weeks[date.week() % config.weeks.length];
    const day = config.days.find(day => day.id === (0, utils_1.DaysToArray)(week.days)[date.day()]);
    if (!day) {
        await interaction.reply({
            content: `Sorry, but the buff with id **${week.days[date.day()]}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
            ephemeral: true
        });
        return;
    }
    await interaction.reply({ embeds: [createDayEmbed(title, day, date)] });
}
exports.postBuff = postBuff;
async function postWeeksBuffs(interaction, date, title) {
    if (!interaction.guildId) {
        await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        return;
    }
    const [config, flag] = await tryGetConfig(interaction, interaction.guildId);
    if (!flag)
        return;
    const week = config.weeks[date.week() % config.weeks.length];
    await interaction.reply({ embeds: [createWeekEmbed(title, week, config.days, date)] });
}
exports.postWeeksBuffs = postWeeksBuffs;
async function postDailyMessage(client) {
    const configs = await BuffManager_2.default.find({});
    const now = (0, dayjs_1.default)();
    for (const config of configs) {
        if (!client.guilds.cache.has(config._id))
            continue;
        const guild = await client.guilds.fetch(config._id);
        if (!guild)
            continue;
        try {
            const messageSettings = config.messageSettings;
            if (!messageSettings.channelId || !messageSettings.hour)
                continue;
            if (!now.isSame((0, dayjs_1.default)(messageSettings.hour, "HH:mm", true), "minute"))
                continue;
            if (!config.days.length || !config.weeks.length)
                continue;
            const channel = await guild.channels.fetch(messageSettings.channelId);
            if (!channel) {
                console.warn(`Invalid posting channel for ${config._id}`);
                continue;
            }
            const week = config.weeks[now.week() % config.weeks.length];
            const day = config.days.find(day => day.id === (0, utils_1.DaysToArray)(week.days)[now.day()]);
            if (!day) {
                console.warn(`Invalid day id for guild ${config._id}`);
                continue;
            }
            await channel.send({ embeds: [createDayEmbed(messageSettings.buffMessage, day, now)] });
            if (messageSettings.dow && messageSettings.dow === now.day())
                await channel.send({ embeds: [createWeekEmbed(messageSettings.weekMessage, week, config.days, now)] });
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.postDailyMessage = postDailyMessage;
class BuffManager extends Module_1.Module {
    constructor() {
        super("BuffManager");
        this.commands = [
            new Command_1.default(new builders_1.SlashCommandBuilder()
                .setName("todays_buff")
                .setDescription("Displays the buff for the day."), async (interaction) => await postBuff(interaction, (0, dayjs_1.default)(), "Today's Buff Shall Be:")),
            new Command_1.default(new builders_1.SlashCommandBuilder()
                .setName("tomorrows_buff")
                .setDescription("Displays the buff for tomorrow."), async (interaction) => await postBuff(interaction, (0, dayjs_1.default)().add(1, "day"), "Tomorrow's Buff Shall Be:")),
            new Command_1.default(new builders_1.SlashCommandBuilder()
                .setName("this_weeks_buff")
                .setDescription("Displays the buffs for the week"), async (interaction) => await postWeeksBuffs(interaction, (0, dayjs_1.default)(), "The Buffs For The Week Shall Be:")),
            new Command_1.default(new builders_1.SlashCommandBuilder()
                .setName("next_weeks_buff")
                .setDescription("Displays the buffs for next week"), async (interaction) => await postWeeksBuffs(interaction, (0, dayjs_1.default)().add(1, "week"), "The Buffs For Next Week Shall Be:"))
        ];
        this.tasks = [
            new Task_1.default("buffManager_dailyMessage_Loop", 60000, async (client) => {
                await Task_1.default.waitTillReady(client);
                await postDailyMessage(client);
            })
        ];
    }
}
exports.default = new BuffManager();
