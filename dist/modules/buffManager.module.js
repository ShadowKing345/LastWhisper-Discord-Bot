var BuffManagerModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { createLogger } from "../utils/loggerService.js";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Command } from "../utils/objects/command.js";
import { authorize } from "../utils/decorators/authorize.js";
import { addPermissionKeys } from "../utils/decorators/addPermissionKeys.js";
let BuffManagerModule = BuffManagerModule_1 = class BuffManagerModule extends ModuleBase {
    buffManagerService;
    static permissionKeys = {
        buffs: {
            today: "BuffManager.buffs.today",
            tomorrow: "BuffManager.buffs.tomorrow",
        },
        weeks: {
            thisWeek: "BuffManager.weeks.thisWeek",
            nextWeek: "BuffManager.weeks.nextWeek",
        },
    };
    moduleName = "BuffManager";
    timers = [
        {
            name: `${this.moduleName}#dailyMessageTask`,
            timeout: 60000,
            execute: async (client) => this.postDailyMessage(client),
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
                    subcommands: {
                        Today: new Command({
                            name: "today",
                            description: "Gets today's buff.",
                        }),
                        Tomorrow: new Command({
                            name: "tomorrow",
                            description: "Gets tomorrow's buff.",
                        }),
                    },
                }),
                Weeks: new Command({
                    name: "weeks",
                    description: "Shows you what buffs for the week, are set to.",
                    subcommands: {
                        ThisWeek: new Command({
                            name: "this_week",
                            description: "Gets this week's buffs.",
                        }),
                        NextWeek: new Command({
                            name: "next_week",
                            description: "Gets next week's buffs",
                        }),
                    },
                }),
            },
            execute: (interaction) => this.commandResolver(interaction),
        }),
    ];
    commandResolverKeys = {
        "buff_manager.buffs.today": this.postTodayBuff.bind(this),
        "buff_manager.buffs.tomorrow": this.postTomorrowsBuff.bind(this),
        "buff_manager.weeks.this_week": this.postThisWeeksBuffs.bind(this),
        "buff_manager.weeks.next_week": this.postNextWeeksBuffs.bind(this),
    };
    constructor(buffManagerService, logger, permissionManagerService) {
        super(permissionManagerService, logger);
        this.buffManagerService = buffManagerService;
    }
    postTodayBuff(interaction) {
        return this.buffManagerService.postBuff(interaction);
    }
    postTomorrowsBuff(interaction) {
        return this.buffManagerService.postBuff(interaction, false);
    }
    postThisWeeksBuffs(interaction) {
        return this.buffManagerService.postWeeksBuffs(interaction);
    }
    postNextWeeksBuffs(interaction) {
        return this.buffManagerService.postWeeksBuffs(interaction, false);
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
], BuffManagerModule.prototype, "postTodayBuff", null);
__decorate([
    authorize(BuffManagerModule_1.permissionKeys.buffs.tomorrow),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postTomorrowsBuff", null);
__decorate([
    authorize(BuffManagerModule_1.permissionKeys.weeks.thisWeek),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postThisWeeksBuffs", null);
__decorate([
    authorize(BuffManagerModule_1.permissionKeys.weeks.nextWeek),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postNextWeeksBuffs", null);
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