var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BuffManagerModule_1;
import chalk from "chalk";
import { injectable } from "tsyringe";
import { ModuleBase } from "../classes/moduleBase.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { addCommandKeys } from "../utils/addCommandKeys.js";
import { buildLogger } from "../utils/logger.js";
let BuffManagerModule = BuffManagerModule_1 = class BuffManagerModule extends ModuleBase {
    buffManagerService;
    static commands = {
        $index: "buff_manager",
        Buffs: { $index: "buffs", Today: "today", Tomorrow: "tomorrow" },
        Weeks: { $index: "weeks", ThisWeek: "this_week", NextWeek: "next_week" },
    };
    logger = buildLogger(BuffManagerModule_1.name);
    constructor(buffManagerService) {
        super();
        this.buffManagerService = buffManagerService;
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
                run: async (interaction) => this.subCommandManager(interaction),
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
    subCommandManager(interaction) {
        this.logger.debug(`${chalk.cyan("Command invoked")}, dealing with subcommand options.`);
        const group = interaction.options.getSubcommandGroup();
        const subCommand = interaction.options.getSubcommand();
        if (!(subCommand && group)) {
            this.logger.debug(`${chalk.red("Expected Failure:")} no ${chalk.blue("subcommand")} or ${chalk.blue("group")} was used.`);
            return interaction.reply({
                content: "Sorry you can only use the group or subcommands not the src command.",
                ephemeral: true,
            });
        }
        if (!interaction.guildId) {
            this.logger.debug(`${chalk.red("Expected Failure:")} Command was attempted to be invoked inside of a direct message.`);
            return interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        }
        if (group === "buffs") {
            return this.postBuff(interaction, subCommand);
        }
        else {
            return this.postWeeksBuffs(interaction, subCommand);
        }
    }
    postBuff(interaction, subCommand) {
        return this.buffManagerService.postBuff(interaction, subCommand);
    }
    postWeeksBuffs(interaction, subCommand) {
        return this.buffManagerService.postWeeksBuffs(interaction, subCommand);
    }
    postDailyMessage(client) {
        return this.buffManagerService.postDailyMessage(client);
    }
};
__decorate([
    addCommandKeys(),
    __metadata("design:type", Object)
], BuffManagerModule, "commands", void 0);
BuffManagerModule = BuffManagerModule_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [BuffManagerService])
], BuffManagerModule);
export { BuffManagerModule };
//# sourceMappingURL=buffManager.module.js.map