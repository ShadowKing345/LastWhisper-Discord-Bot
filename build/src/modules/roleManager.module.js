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
import { Command, CommandOption } from "../utils/objects/command.js";
import { EventListener } from "../utils/objects/eventListener.js";
let RoleManagerModule = RoleManagerModule_1 = class RoleManagerModule extends ModuleBase {
    roleManagerService;
    moduleName = "RoleManager";
    eventListeners = [
        new EventListener("ready", async (client) => this.onReady(client)),
    ];
    commands = [
        new Command({
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
                        new CommandOption({
                            name: "message_id",
                            description: "The ID for the message.",
                            required: true,
                        }),
                    ],
                },
                UnregisterMessage: {
                    name: "unregister_message",
                    description: "Unregisters a message to be reacted to.",
                    options: [
                        new CommandOption({
                            name: "message_id",
                            description: "The ID for the message.",
                            required: true,
                        }),
                    ],
                },
            },
            execute: interaction => this.commandResolver(interaction),
        }),
    ];
    commandResolverKeys = {
        "role_manager.revoke_role": this.revokeRole,
        "role_manager.register_message": this.registerMessage,
        "role_manager.unregister_message": this.unregisterMessage,
    };
    constructor(roleManagerService, logger, permissionManagerService) {
        super(permissionManagerService, logger);
        this.roleManagerService = roleManagerService;
    }
    onReady(client) {
        return this.roleManagerService.onReady(client);
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