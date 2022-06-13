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
var RoleManagerModule_1;
import chalk from "chalk";
import { CommandInteraction } from "discord.js";
import { pino } from "pino";
import { injectWithTransform, singleton } from "tsyringe";
import { addCommandKeys, authorize, PermissionManagerService } from "../permission_manager/index.js";
import { LoggerFactory, LoggerFactoryTransformer } from "../shared/logger.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { RoleManagerService } from "./roleManager.service.js";
let RoleManagerModule = RoleManagerModule_1 = class RoleManagerModule extends ModuleBase {
    roleManagerService;
    permissionManager;
    logger;
    static commands = {
        $index: "role_manager",
        RevokeRole: "revoke_role",
        RegisterMessage: "register_message",
        UnregisterMessage: "unregister_message",
    };
    constructor(roleManagerService, permissionManager, logger) {
        super();
        this.roleManagerService = roleManagerService;
        this.permissionManager = permissionManager;
        this.logger = logger;
        this.moduleName = "RoleManager";
        this.listeners = [
            { event: "ready", run: async (client) => this.onReady(client) },
        ];
        this.commands = [
            {
                command: builder => builder
                    .setName(RoleManagerModule_1.commands.$index)
                    .setDescription("Manages roles within a guild.")
                    .addSubcommand(sBuilder => sBuilder
                    .setName(RoleManagerModule_1.commands.RevokeRole)
                    .setDescription("Revokes the role for all uses."))
                    .addSubcommand(sBuilder => sBuilder
                    .setName(RoleManagerModule_1.commands.RegisterMessage)
                    .setDescription("Registers a message to be reacted to.")
                    .addStringOption(iBuilder => iBuilder
                    .setName("message_id")
                    .setDescription("The ID for the message.")
                    .setRequired(true)))
                    .addSubcommand(sBuilder => sBuilder
                    .setName(RoleManagerModule_1.commands.UnregisterMessage)
                    .setDescription("Unregisters a message to be reacted to.")
                    .addStringOption(iBuilder => iBuilder
                    .setName("message_id")
                    .setDescription("The ID for the message.")
                    .setRequired(true))),
                run: interaction => this.subcommandResolver(interaction)
            }
        ];
    }
    onReady(client) {
        return this.roleManagerService.onReady(client);
    }
    subcommandResolver(interaction) {
        this.logger.debug(`${chalk.cyan("Command invoked")}, dealing with subcommand options.`);
        const subCommand = interaction.options.getSubcommand();
        if (!subCommand) {
            this.logger.debug(`${chalk.red("Expected Failure:")} no ${chalk.blue("subcommand")} was used.`);
            return interaction.reply({
                content: "Sorry you have to use a subcommand.",
                ephemeral: true,
            });
        }
        if (!interaction.guildId) {
            this.logger.debug(`${chalk.red("Expected Failure:")} Command was attempted to be invoked inside of a direct message.`);
            return interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        }
        switch (subCommand) {
            case "revoke_role":
                return this.revokeRole(interaction);
            case "register_message":
                return this.registerMessage(interaction);
            case "unregister_message":
                return this.unregisterMessage(interaction);
            default:
                this.logger.debug(`${chalk.red("Expected Failure:")} subcommand not found.`);
                return interaction.reply("Sorry but this command can only be executed in a Guild not a direct / private message");
        }
    }
    revokeRole(interaction) {
        return this.roleManagerService.revokeRole(interaction);
    }
    registerMessage(interaction) {
        return this.roleManagerService.registerMessage(interaction);
    }
    unregisterMessage(interaction) {
        return this.roleManagerService.unregisterMessage(interaction);
    }
};
__decorate([
    authorize(RoleManagerModule_1.commands.$index, RoleManagerModule_1.commands.RevokeRole),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], RoleManagerModule.prototype, "revokeRole", null);
__decorate([
    authorize(RoleManagerModule_1.commands.$index, RoleManagerModule_1.commands.RegisterMessage),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], RoleManagerModule.prototype, "registerMessage", null);
__decorate([
    authorize(RoleManagerModule_1.commands.$index, RoleManagerModule_1.commands.UnregisterMessage),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], RoleManagerModule.prototype, "unregisterMessage", null);
__decorate([
    addCommandKeys(),
    __metadata("design:type", Object)
], RoleManagerModule, "commands", void 0);
RoleManagerModule = RoleManagerModule_1 = __decorate([
    singleton(),
    __param(2, injectWithTransform(LoggerFactory, LoggerFactoryTransformer, RoleManagerModule_1.name)),
    __metadata("design:paramtypes", [RoleManagerService,
        PermissionManagerService, Object])
], RoleManagerModule);
export { RoleManagerModule };
//# sourceMappingURL=roleManager.module.js.map