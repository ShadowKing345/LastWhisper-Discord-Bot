var BuffManagerModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { pino } from "pino";
import { createLogger } from "../utils/loggerService.js";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Command, CommandOption } from "../utils/objects/command.js";
import { authorize } from "../utils/decorators/authorize.js";
import { addPermissionKeys } from "../utils/decorators/addPermissionKeys.js";
import { DateTime } from "luxon";
let BuffManagerModule = BuffManagerModule_1 = class BuffManagerModule extends ModuleBase {
    buffManagerService;
    static permissionKeys = {
        buffs: {
            today: "BuffManager.buffs.today",
            tomorrow: "BuffManager.buffs.tomorrow"
        },
        weeks: {
            thisWeek: "BuffManager.weeks.thisWeek",
            nextWeek: "BuffManager.weeks.nextWeek"
        }
    };
    moduleName = "BuffManager";
    timers = [
        {
            name: `${this.moduleName}#dailyMessageTask`,
            timeout: 60000,
            execute: this.postDailyMessage.bind(this)
        }
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
                            type: ApplicationCommandOptionType.Boolean
                        }),
                        new CommandOption({
                            name: "date",
                            description: "Get the buff for a specific date. Use ISO 8601 format.",
                            required: false,
                            type: ApplicationCommandOptionType.String
                        })
                    ]
                }),
                Weeks: new Command({
                    name: "weeks",
                    description: "Shows you what buffs for the week, are set to.",
                    options: [
                        new CommandOption({
                            name: "next_week",
                            description: "Set to true if buff is for tomorrow.",
                            required: false,
                            type: ApplicationCommandOptionType.Boolean
                        }),
                        new CommandOption({
                            name: "date",
                            description: "Get the week for a specific date. Use ISO 8601 format.",
                            required: false,
                            type: ApplicationCommandOptionType.String
                        })
                    ]
                })
            },
            execute: this.commandResolver.bind(this)
        })
    ];
    commandResolverKeys = {
        "buff_manager.buffs": this.postBuff.bind(this),
        "buff_manager.weeks": this.postWeek.bind(this)
    };
    constructor(buffManagerService, logger, permissionManagerService) {
        super(permissionManagerService, logger);
        this.buffManagerService = buffManagerService;
    }
    postBuff(interaction) {
        const tomorrow = interaction.options.getBoolean("tomorrow");
        const dateString = interaction.options.getString("date");
        let date = DateTime.fromJSDate(interaction.createdAt);
        if (tomorrow) {
            date = date.plus({ day: 1 });
        }
        else if (dateString) {
            date = DateTime.fromISO(dateString);
        }
        return this.buffManagerService.postBuff(interaction, date);
    }
    postWeek(interaction) {
        return this.buffManagerService.postWeek(interaction);
    }
    postDailyMessage(client) {
        return this.buffManagerService.postDailyMessage(client);
    }
};
__decorate([
    authorize(BuffManagerModule_1.permissionKeys.buffs.today),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postBuff", null);
__decorate([
    authorize(BuffManagerModule_1.permissionKeys.weeks.thisWeek),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postWeek", null);
__decorate([
    addPermissionKeys(),
    __metadata("design:type", Object)
], BuffManagerModule, "permissionKeys", void 0);
BuffManagerModule = BuffManagerModule_1 = __decorate([
    registerModule(),
    __param(1, createLogger(BuffManagerModule_1.name)),
    __metadata("design:paramtypes", [BuffManagerService, Object, PermissionManagerService])
], BuffManagerModule);
export { BuffManagerModule };
//# sourceMappingURL=buffManager.module.js.map