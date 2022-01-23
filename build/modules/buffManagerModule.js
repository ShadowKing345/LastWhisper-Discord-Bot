"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var BuffManagerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuffManagerModule = void 0;
const moduleBase_1 = require("../classes/moduleBase");
const dayjs_1 = __importDefault(require("dayjs"));
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const task_1 = require("../classes/task");
const buffManagerConfigService_1 = require("../services/buffManagerConfigService");
const typedi_1 = require("typedi");
let BuffManagerModule = BuffManagerModule_1 = class BuffManagerModule extends moduleBase_1.ModuleBase {
    constructor(service) {
        super();
        this.service = service;
        this._moduleName = "BuffManager";
        this._commands = [
            {
                command: builder => builder.setName("todays_buff").setDescription("Displays the buff for the day."),
                run: async (interaction) => await this.postBuff(interaction, (0, dayjs_1.default)(), "Today's Buff Shall Be:")
            },
            {
                command: builder => builder.setName("tomorrows_buff").setDescription("Displays the buff for tomorrow."),
                run: async (interaction) => await this.postBuff(interaction, (0, dayjs_1.default)().add(1, "day"), "Tomorrow's Buff Shall Be:")
            },
            {
                command: builder => builder.setName("this_weeks_buffs").setDescription("Displays the buffs for the week"),
                run: async (interaction) => await this.postWeeksBuffs(interaction, (0, dayjs_1.default)(), "The Buffs For The Week Shall Be:")
            },
            {
                command: builder => builder.setName("next_weeks_buffs").setDescription("Displays the buffs for next week"),
                run: async (interaction) => await this.postWeeksBuffs(interaction, (0, dayjs_1.default)().add(1, "week"), "The Buffs For Next Week Shall Be:")
            }
        ];
        this._tasks = [
            {
                name: `${this.moduleName}#dailyMessageTask`,
                timeout: 60000,
                run: async (client) => await this.postDailyMessage(client)
            }
        ];
    }
    static createDayEmbed(title, day, date) {
        return new discord_js_1.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(title)
            .setDescription(day.text)
            .setThumbnail(day.imageUrl)
            .setFooter({ text: date.format("dddd Do MMMM YYYY") });
    }
    static createWeekEmbed(title, week, days, date) {
        const _days = (0, utils_1.DaysToArray)(week.days).map((dayId, index) => {
            const dow = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index];
            const day = days.find(entry => entry.id === dayId) ?? { text: "No Buff Found" };
            return { name: dow, value: day.text, inline: true };
        });
        return new discord_js_1.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(title)
            .setDescription(week.title)
            .addFields(_days)
            .setFooter({ text: `Week ${date.week()}.` });
    }
    async tryGetConfig(interaction, guildId) {
        const config = await this.service.findOneOrCreate(guildId);
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
    async postBuff(interaction, date, title) {
        if (!interaction.guildId) {
            await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
            return;
        }
        const [config, flag] = await this.tryGetConfig(interaction, interaction.guildId);
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
        await interaction.reply({ embeds: [BuffManagerModule_1.createDayEmbed(title, day, date)] });
    }
    async postWeeksBuffs(interaction, date, title) {
        if (!interaction.guildId) {
            await interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
            return;
        }
        const [config, flag] = await this.tryGetConfig(interaction, interaction.guildId);
        if (!flag)
            return;
        const week = config.weeks[date.week() % config.weeks.length];
        await interaction.reply({ embeds: [BuffManagerModule_1.createWeekEmbed(title, week, config.days, date)] });
    }
    async postDailyMessage(client) {
        await task_1.Task.waitTillReady(client);
        const configs = await this.service.getAll();
        const now = (0, dayjs_1.default)();
        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId))
                continue;
            const guild = await client.guilds.fetch(config.guildId);
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
                    console.warn(`Invalid posting channel for ${config.guildId}`);
                    continue;
                }
                const week = config.weeks[now.week() % config.weeks.length];
                const day = config.days.find(day => day.id === (0, utils_1.DaysToArray)(week.days)[now.day()]);
                if (!day) {
                    console.warn(`Invalid day id for guild ${config.guildId}`);
                    continue;
                }
                await channel.send({ embeds: [BuffManagerModule_1.createDayEmbed(messageSettings.buffMessage, day, now)] });
                if (messageSettings.dow && messageSettings.dow === now.day())
                    await channel.send({ embeds: [BuffManagerModule_1.createWeekEmbed(messageSettings.weekMessage, week, config.days, now)] });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
};
BuffManagerModule = BuffManagerModule_1 = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [buffManagerConfigService_1.BuffManagerConfigService])
], BuffManagerModule);
exports.BuffManagerModule = BuffManagerModule;
