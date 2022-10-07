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
import { CommandInteraction } from "discord.js";
import { pino } from "pino";
import { authorize } from "../utils/decorators/authorize.js";
import { createLogger } from "../utils/loggerService.js";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { PermissionKeysType } from "../models/permission_manager/index.js";
let BuffManagerModule = BuffManagerModule_1 = class BuffManagerModule extends ModuleBase {
    buffManagerService;
    logger;
    static commands = new PermissionKeysType({
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
    });
    constructor(buffManagerService, logger, permissionManagerService) {
        super(permissionManagerService);
        this.buffManagerService = buffManagerService;
        this.logger = logger;
        this.moduleName = "BuffManager";
        this.commands = [
            {
                command: () => BuffManagerModule_1.commands.build(),
                run: async (interaction) => this.subcommandResolver(interaction),
            },
        ];
        this.tasks = [
            {
                name: `${this.moduleName}#dailyMessageTask`,
                timeout: 60000,
                run: async (client) => this.postDailyMessage(client),
            },
        ];
        this.listeners = [
            {
                event: "ready",
                run: () => { throw new Error("Testing"); },
            },
        ];
    }
    subcommandResolver(interaction) {
        this.logger.debug(`Command invoked, dealing with subcommand options.`);
        const group = interaction.options.getSubcommandGroup();
        const subCommand = interaction.options.getSubcommand();
        if (!(subCommand && group)) {
            this.logger.debug(`Expected Failure:")} no "subcommand" or group was used.`);
            return interaction.reply({
                content: "Sorry you can only use the group or subcommands not the src command.",
                ephemeral: true,
            });
        }
        if (!interaction.guildId) {
            this.logger.debug(`Expected Failure: Command was attempted to be invoked inside of a direct message.`);
            return interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        }
        switch (group) {
            case BuffManagerModule_1.commands.subcommands.Buffs?.name:
                switch (subCommand) {
                    case BuffManagerModule_1.commands.subcommands.Buffs?.subcommands.Today:
                        return this.postTodayBuff(interaction);
                    case BuffManagerModule_1.commands.subcommands.Buffs?.subcommands.Tomorrow:
                        return this.postTomorrowsBuff(interaction);
                    default:
                        this.logger.debug(`Expected Failure: Cannot find subcommand.`);
                        return interaction.reply({
                            content: "Cannot find subcommand.",
                            ephemeral: true,
                        });
                }
            case BuffManagerModule_1.commands.subcommands.Weeks?.name:
                switch (subCommand) {
                    case BuffManagerModule_1.commands.subcommands.Weeks?.subcommands.ThisWeek:
                        return this.postThisWeeksBuffs(interaction);
                    case BuffManagerModule_1.commands.subcommands.Weeks?.subcommands.NextWeek:
                        return this.postNextWeeksBuffs(interaction);
                    default:
                        this.logger.debug(`Expected Failure: Cannot find subcommand.`);
                        return interaction.reply({
                            content: "Cannot find subcommand.",
                            ephemeral: true,
                        });
                }
            default:
                this.logger.debug(`Expected Failure: Cannot find subcommand group.`);
                return interaction.reply({
                    content: "Cannot find group.",
                    ephemeral: true,
                });
        }
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
    authorize(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postTodayBuff", null);
__decorate([
    authorize(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postTomorrowsBuff", null);
__decorate([
    authorize(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postThisWeeksBuffs", null);
__decorate([
    authorize(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postNextWeeksBuffs", null);
BuffManagerModule = BuffManagerModule_1 = __decorate([
    registerModule(),
    __param(1, createLogger(BuffManagerModule_1.name)),
    __metadata("design:paramtypes", [BuffManagerService, Object, PermissionManagerService])
], BuffManagerModule);
export { BuffManagerModule };
//# sourceMappingURL=buffManager.module.js.map