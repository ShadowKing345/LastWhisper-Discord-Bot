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
import { pino } from "pino";
import { ModuleBase } from "../utils/models/index.js";
import { createLogger } from "../utils/loggerService.js";
import { RoleManagerService } from "../services/roleManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";
let RoleManagerModule = RoleManagerModule_1 = class RoleManagerModule extends ModuleBase {
    roleManagerService;
    logger;
    moduleName = "RoleManager";
    listeners = [
        { event: "ready", run: async (client) => this.onReady(client) },
    ];
    commands = [
        new CommandBuilder({
            name: "role_manager",
            description: "Manages roles within a guild.",
            subcommands: {
                RevokeRole: {
                    name: "revoke_role",
                    description: "Revokes the role for all uses.",
                },
                RegisterMessage: {
                    name: "register_message",
                    description: "Registers a message to be reacted to.",
                    options: [
                        new CommandBuilderOption({
                            name: "message_id",
                            description: "The ID for the message.",
                            required: true,
                        }),
                    ]
                },
                UnregisterMessage: {
                    name: "unregister_message",
                    description: "Unregisters a message to be reacted to.",
                    options: [
                        new CommandBuilderOption({
                            name: "message_id",
                            description: "The ID for the message.",
                            required: true,
                        }),
                    ]
                },
            },
            execute: interaction => this.subcommandResolver(interaction),
        }),
    ];
    constructor(roleManagerService, logger, permissionManagerService) {
        super(permissionManagerService);
        this.roleManagerService = roleManagerService;
        this.logger = logger;
    }
    onReady(client) {
        return this.roleManagerService.onReady(client);
    }
    subcommandResolver(interaction) {
        this.logger.debug(`Command invoked, dealing with subcommand options.`);
        const subCommand = interaction.options.getSubcommand();
        if (!subCommand) {
            this.logger.debug(`Expected Failure:")} no subcommand was used.`);
            return interaction.reply({
                content: "Sorry you have to use a subcommand.",
                ephemeral: true,
            });
        }
        if (!interaction.guildId) {
            this.logger.debug(`Expected Failure: Command was attempted to be invoked inside of a direct message.`);
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
                this.logger.debug(`Expected Failure: subcommand not found.`);
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
RoleManagerModule = RoleManagerModule_1 = __decorate([
    registerModule(),
    __param(1, createLogger(RoleManagerModule_1.name)),
    __metadata("design:paramtypes", [RoleManagerService, Object, PermissionManagerService])
], RoleManagerModule);
export { RoleManagerModule };
//# sourceMappingURL=roleManager.module.js.map