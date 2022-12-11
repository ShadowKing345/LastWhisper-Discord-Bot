var BuffManagerModule_1;
import { __decorate, __metadata } from "tslib";
import { ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { Module } from "./module.js";
import { BuffManagerService, BuffManagerTryGetError, BuffManagerTryGetErrorReasons } from "../services/buffManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { module, authorize, addPermissionKeys, deferReply } from "../utils/decorators/index.js";
import { Command, CommandOption } from "../utils/objects/command.js";
import { DateTime } from "luxon";
import { Logger } from "../utils/logger.js";
let BuffManagerModule = BuffManagerModule_1 = class BuffManagerModule extends Module {
    service;
    logger = new Logger(BuffManagerModule_1);
    static permissionKeys = {
        buffs: "BuffManager.buffs",
        weeks: "BuffManager.weeks",
    };
    moduleName = "BuffManager";
    timers = [
        {
            name: `${this.moduleName}#dailyMessageTask`,
            timeout: 60000,
            execute: this.postDailyMessage.bind(this),
        },
    ];
    commands = [
        new Command({
            name: "buff_manager",
            description: "Manages all things related to buffs",
            subcommands: {
                Buffs: new Command({
                    name: "buffs",
                    description: "Shows you what buffs are set.",
                    options: [
                        new CommandOption({
                            name: "tomorrow",
                            description: "Set to true if buff is for tomorrow.",
                            required: false,
                            type: ApplicationCommandOptionType.Boolean,
                        }),
                        new CommandOption({
                            name: "date",
                            description: "Get the buff for a specific date. Use ISO 8601 format.",
                            required: false,
                            type: ApplicationCommandOptionType.String,
                        }),
                    ],
                }),
                Weeks: new Command({
                    name: "weeks",
                    description: "Shows you what buffs for the week, are set to.",
                    options: [
                        new CommandOption({
                            name: "next_week",
                            description: "Set to true if buff is for tomorrow.",
                            required: false,
                            type: ApplicationCommandOptionType.Boolean,
                        }),
                        new CommandOption({
                            name: "date",
                            description: "Get the week for a specific date. Use ISO 8601 format.",
                            required: false,
                            type: ApplicationCommandOptionType.String,
                        }),
                    ],
                }),
            },
            execute: this.commandResolver.bind(this),
        }),
    ];
    commandResolverKeys = {
        "buff_manager.buffs": this.postBuffCommand.bind(this),
        "buff_manager.weeks": this.postWeekCommand.bind(this),
    };
    constructor(service, permissionManagerService) {
        super(permissionManagerService);
        this.service = service;
    }
    async postBuffCommand(interaction) {
        const tomorrow = interaction.options.getBoolean("tomorrow");
        const dateString = interaction.options.getString("date");
        let date = DateTime.fromJSDate(interaction.createdAt);
        if (tomorrow) {
            date = date.plus({ day: 1 });
        }
        else if (dateString) {
            date = DateTime.fromISO(dateString);
        }
        this.logger.debug(`Command invoked for buffs.\nPosting buff message for the date ${date.toISO()}.`);
        let buff;
        try {
            buff = await this.service.getBuffByDate(interaction.guildId, date);
        }
        catch (error) {
            if (!(error instanceof BuffManagerTryGetError)) {
                throw error;
            }
            switch (error.reason) {
                case BuffManagerTryGetErrorReasons.UNKNOWN:
                    throw error;
                case BuffManagerTryGetErrorReasons.WEEKS:
                    await interaction.editReply({ content: "Sorry the are no weeks setup in your guild." });
                    return;
                case BuffManagerTryGetErrorReasons.BUFFS:
                    await interaction.editReply({ content: "Sorry the are no buffs setup in your guild." });
                    return;
            }
        }
        if (!buff) {
            this.logger.debug(`Buff did not exit.`);
            await interaction.editReply({
                content: `Sorry, The buff for the date ${date.toISO()} does not exist in the collection of buffs. Kindly contact a manager or administration to resolve this issue.`,
            });
        }
        await interaction.editReply({ embeds: [this.service.createBuffEmbed("The Buff Shall Be:", buff, date)] });
    }
    async postWeekCommand(interaction) {
        const nextWeek = interaction.options.getBoolean("next_week");
        const dateString = interaction.options.getString("date");
        let date = DateTime.fromJSDate(interaction.createdAt);
        if (nextWeek) {
            date = date.plus({ day: 1 });
        }
        else if (dateString) {
            date = DateTime.fromISO(dateString);
        }
        this.logger.debug(`Command invoked for weeks.\nPosting week message for ${date.toISO()}.`);
        let week;
        try {
            week = await this.service.getWeekByDate(interaction.guildId, date);
        }
        catch (error) {
            if (!(error instanceof BuffManagerTryGetError)) {
                throw error;
            }
            switch (error.reason) {
                case BuffManagerTryGetErrorReasons.UNKNOWN:
                    throw error;
                case BuffManagerTryGetErrorReasons.WEEKS:
                    await interaction.editReply({ content: "Sorry the are no weeks setup in your guild." });
                    return;
                case BuffManagerTryGetErrorReasons.BUFFS:
                    await interaction.editReply({ content: "Sorry the are no buffs setup in your guild." });
                    return;
            }
        }
        await interaction.editReply({
            embeds: [this.service.createWeekEmbed("The Buffs For The Week Shall Be:", week, date)],
        });
    }
    postDailyMessage(client) {
        return this.service.postDailyMessage(client);
    }
};
__decorate([
    authorize(BuffManagerModule_1.permissionKeys.buffs),
    deferReply(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postBuffCommand", null);
__decorate([
    authorize(BuffManagerModule_1.permissionKeys.weeks),
    deferReply(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postWeekCommand", null);
__decorate([
    addPermissionKeys(),
    __metadata("design:type", Object)
], BuffManagerModule, "permissionKeys", void 0);
BuffManagerModule = BuffManagerModule_1 = __decorate([
    module(),
    __metadata("design:paramtypes", [BuffManagerService,
        PermissionManagerService])
], BuffManagerModule);
export { BuffManagerModule };
//# sourceMappingURL=buffManager.js.map