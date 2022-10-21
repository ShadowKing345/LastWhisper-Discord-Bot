var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BuffManagerModule_1;
import { pino } from "pino";
import { createLogger } from "../utils/loggerService.js";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Command } from "../utils/objects/command.js";
let BuffManagerModule = BuffManagerModule_1 = class BuffManagerModule extends ModuleBase {
    buffManagerService;
    moduleName = "BuffManager";
    tasks = [
        {
            name: `${this.moduleName}#dailyMessageTask`,
            timeout: 60000,
            run: async (client) => this.postDailyMessage(client),
        },
    ];
    commands = [
        new Command({
            name: "buff_manager",
            description: "Manages all things related to buffs",
            subcommands: {
                Buffs: {
                    name: "buffs",
                    description: "Shows you what buffs are set.",
                    subcommands: {
                        Today: {
                            name: "today",
                            description: "Gets today's buff.",
                        },
                        Tomorrow: {
                            name: "tomorrow",
                            description: "Gets tomorrow's buff.",
                        },
                    },
                },
                Weeks: {
                    name: "weeks",
                    description: "Shows you what buffs for the week, are set to.",
                    subcommands: {
                        ThisWeek: {
                            name: "this_week",
                            description: "Gets this week's buffs.",
                        },
                        NextWeek: {
                            name: "next_week",
                            description: "Gets next week's buffs",
                        },
                    },
                },
            },
            execute: interaction => this.commandResolver(interaction),
        }),
    ];
    commandResolverKeys = {
        "buff_manager.buffs.today": this.postTodayBuff,
        "buff_manager.buffs.tomorrow": this.postTomorrowsBuff,
        "buff_manager.weeks.this_week": this.postThisWeeksBuffs,
        "buff_manager.weeks.next_week": this.postNextWeeksBuffs,
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
BuffManagerModule = BuffManagerModule_1 = __decorate([
    registerModule(),
    __param(1, createLogger(BuffManagerModule_1.name)),
    __metadata("design:paramtypes", [BuffManagerService, Object, PermissionManagerService])
], BuffManagerModule);
export { BuffManagerModule };
//# sourceMappingURL=buffManager.module.js.map