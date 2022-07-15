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
import { singleton } from "tsyringe";
import { addCommandKeys, authorize } from "../permission_manager/index.js";
import { createLogger } from "../shared/logger/logger.decorator.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { BuffManagerService } from "./buffManager.service.js";
let BuffManagerModule = BuffManagerModule_1 = class BuffManagerModule extends ModuleBase {
    buffManagerService;
    logger;
    static commands = {
        $index: "buff_manager",
        Buffs: { $index: "buffs", Today: "today", Tomorrow: "tomorrow" },
        Weeks: { $index: "weeks", ThisWeek: "this_week", NextWeek: "next_week" },
    };
    constructor(buffManagerService, logger) {
        super();
        this.buffManagerService = buffManagerService;
        this.logger = logger;
        this.moduleName = "BuffManager";
        this.commands = [
            {
                command: builder => builder
                    .setName(BuffManagerModule_1.commands.$index)
                    .setDescription("Manages all things related to buffs")
                    .addSubcommandGroup(subGroup => subGroup
                    .setName(BuffManagerModule_1.commands.Buffs.$index)
                    .setDescription("Shows you what buffs are set.")
                    .addSubcommand(subBuilder => subBuilder.setName(BuffManagerModule_1.commands.Buffs.Today).setDescription("Gets today's buff."))
                    .addSubcommand(subBuilder => subBuilder.setName(BuffManagerModule_1.commands.Buffs.Tomorrow).setDescription("Gets tomorrow's buff.")))
                    .addSubcommandGroup(subGroup => subGroup
                    .setName(BuffManagerModule_1.commands.Weeks.$index)
                    .setDescription("Shows you what buffs for the week, are set to.")
                    .addSubcommand(subBuilder => subBuilder.setName(BuffManagerModule_1.commands.Weeks.ThisWeek).setDescription("Gets this week's buffs."))
                    .addSubcommand(subBuilder => subBuilder.setName(BuffManagerModule_1.commands.Weeks.NextWeek).setDescription("Gets next week's buffs"))),
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
            case BuffManagerModule_1.commands.Buffs.$index:
                switch (subCommand) {
                    case BuffManagerModule_1.commands.Buffs.Today:
                        return this.postTodayBuff(interaction);
                    case BuffManagerModule_1.commands.Buffs.Tomorrow:
                        return this.postTomorrowsBuff(interaction);
                    default:
                        this.logger.debug(`Expected Failure: Cannot find subcommand.`);
                        return interaction.reply({
                            content: "Cannot find subcommand.",
                            ephemeral: true,
                        });
                }
            case BuffManagerModule_1.commands.Weeks.$index:
                switch (subCommand) {
                    case BuffManagerModule_1.commands.Weeks.ThisWeek:
                        return this.postThisWeeksBuffs(interaction);
                    case BuffManagerModule_1.commands.Weeks.NextWeek:
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
    authorize(BuffManagerModule_1.commands.$index, BuffManagerModule_1.commands.Buffs.$index, BuffManagerModule_1.commands.Buffs.Today),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postTodayBuff", null);
__decorate([
    authorize(BuffManagerModule_1.commands.$index, BuffManagerModule_1.commands.Buffs.$index, BuffManagerModule_1.commands.Buffs.Tomorrow),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postTomorrowsBuff", null);
__decorate([
    authorize(BuffManagerModule_1.commands.$index, BuffManagerModule_1.commands.Weeks.$index, BuffManagerModule_1.commands.Weeks.ThisWeek),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postThisWeeksBuffs", null);
__decorate([
    authorize(BuffManagerModule_1.commands.$index, BuffManagerModule_1.commands.Weeks.$index, BuffManagerModule_1.commands.Weeks.NextWeek),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], BuffManagerModule.prototype, "postNextWeeksBuffs", null);
__decorate([
    addCommandKeys(),
    __metadata("design:type", Object)
], BuffManagerModule, "commands", void 0);
BuffManagerModule = BuffManagerModule_1 = __decorate([
    singleton(),
    __param(1, createLogger(BuffManagerModule_1.name)),
    __metadata("design:paramtypes", [BuffManagerService, Object])
], BuffManagerModule);
export { BuffManagerModule };
//# sourceMappingURL=buffManager.module.js.map