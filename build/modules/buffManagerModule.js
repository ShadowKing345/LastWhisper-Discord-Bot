var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ModuleBase } from "../classes/moduleBase.js";
import dayjs from "dayjs";
import { MessageEmbed } from "discord.js";
import { DaysToArray } from "../utils/utils.js";
import { Task } from "../classes/task.js";
import { BuffManagerConfigService } from "../services/buffManagerConfigService.js";
export class BuffManagerModule extends ModuleBase {
    constructor() {
        super();
        this.service = new BuffManagerConfigService();
        this._moduleName = "BuffManager";
        this._commands = [
            {
                command: builder => builder.setName("todays_buff").setDescription("Displays the buff for the day."),
                run: (interaction) => __awaiter(this, void 0, void 0, function* () { return this.postBuff(interaction, dayjs(), "Today's Buff Shall Be:"); })
            },
            {
                command: builder => builder.setName("tomorrows_buff").setDescription("Displays the buff for tomorrow."),
                run: (interaction) => __awaiter(this, void 0, void 0, function* () { return this.postBuff(interaction, dayjs().add(1, "day"), "Tomorrow's Buff Shall Be:"); })
            },
            {
                command: builder => builder.setName("this_weeks_buffs").setDescription("Displays the buffs for the week"),
                run: (interaction) => __awaiter(this, void 0, void 0, function* () { return this.postWeeksBuffs(interaction, dayjs(), "The Buffs For The Week Shall Be:"); })
            },
            {
                command: builder => builder.setName("next_weeks_buffs").setDescription("Displays the buffs for next week"),
                run: (interaction) => __awaiter(this, void 0, void 0, function* () { return this.postWeeksBuffs(interaction, dayjs().add(1, "week"), "The Buffs For Next Week Shall Be:"); })
            }
        ];
        this._tasks = [
            {
                name: `${this.moduleName}#dailyMessageTask`,
                timeout: 60000,
                run: (client) => __awaiter(this, void 0, void 0, function* () { return this.postDailyMessage(client); })
            }
        ];
    }
    static createDayEmbed(title, day, date) {
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: day.text,
            thumbnail: { url: day.imageUrl },
            footer: { text: date.format("dddd Do MMMM YYYY") }
        });
    }
    static createWeekEmbed(title, week, days, date) {
        const _days = DaysToArray(week.days).map((dayId, index) => {
            var _a;
            const dow = this.daysOfWeek[index];
            const day = (_a = days.find(entry => entry.id === dayId)) !== null && _a !== void 0 ? _a : { text: "No Buff Found" };
            return { name: dow, value: day.text, inline: true };
        });
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: week.title,
            fields: _days,
            footer: { text: `Week ${date.week()}.` }
        });
    }
    tryGetConfig(interaction, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.service.findOneOrCreate(guildId);
            if (config.days.length <= 0) {
                yield interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true });
                return [null, false];
            }
            if (config.weeks.length <= 0) {
                yield interaction.reply({ content: "Sorry, there are not weeks set.", ephemeral: true });
                return [null, false];
            }
            return [config, true];
        });
    }
    postBuff(interaction, date, title) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guildId) {
                yield interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
                return;
            }
            const [config, flag] = yield this.tryGetConfig(interaction, interaction.guildId);
            if (!flag)
                return;
            const week = config.weeks[date.week() % config.weeks.length];
            const day = config.days.find(day => day.id === DaysToArray(week.days)[date.day()]);
            if (!day) {
                yield interaction.reply({
                    content: `Sorry, but the buff with id **${week.days[date.day()]}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
                    ephemeral: true
                });
                return;
            }
            yield interaction.reply({ embeds: [BuffManagerModule.createDayEmbed(title, day, date)] });
        });
    }
    postWeeksBuffs(interaction, date, title) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guildId) {
                yield interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
                return;
            }
            const [config, flag] = yield this.tryGetConfig(interaction, interaction.guildId);
            if (!flag)
                return;
            const week = config.weeks[date.week() % config.weeks.length];
            yield interaction.reply({ embeds: [BuffManagerModule.createWeekEmbed(title, week, config.days, date)] });
        });
    }
    postDailyMessage(client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Task.waitTillReady(client);
            const configs = yield this.service.getAll();
            const now = dayjs();
            for (const config of configs) {
                if (!client.guilds.cache.has(config.guildId))
                    continue;
                const guild = yield client.guilds.fetch(config.guildId);
                if (!guild)
                    continue;
                try {
                    const messageSettings = config.messageSettings;
                    if (!messageSettings.channelId || !messageSettings.hour)
                        continue;
                    if (!now.isSame(dayjs(messageSettings.hour, "HH:mm", true), "minute"))
                        continue;
                    if (!config.days.length || !config.weeks.length)
                        continue;
                    const channel = yield guild.channels.fetch(messageSettings.channelId);
                    if (!channel) {
                        console.warn(`Invalid posting channel for ${config.guildId}`);
                        continue;
                    }
                    const week = config.weeks[now.week() % config.weeks.length];
                    const day = config.days.find(day => day.id === DaysToArray(week.days)[now.day()]);
                    if (!day) {
                        console.warn(`Invalid day id for guild ${config.guildId}`);
                        continue;
                    }
                    yield channel.send({ embeds: [BuffManagerModule.createDayEmbed(messageSettings.buffMessage, day, now)] });
                    if (messageSettings.dow && messageSettings.dow === now.day())
                        yield channel.send({ embeds: [BuffManagerModule.createWeekEmbed(messageSettings.weekMessage, week, config.days, now)] });
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    }
}
BuffManagerModule.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//# sourceMappingURL=buffManagerModule.js.map