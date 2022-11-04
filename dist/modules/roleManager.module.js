var RoleManagerModule_1;
import { __decorate, __metadata, __param } from "tslib";
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
    eventListeners = [new EventListener("ready", async (client) => this.onReady(client))];
    commands = [
        new Command({
            name: "role_manager",
            description: "Manages roles within a guild.",
            subcommands: {
                RevokeRole: new Command({
                    name: "revoke_role",
                    description: "Revokes the role for all uses.",
                }),
                RegisterMessage: new Command({
                    name: "register_message",
                    description: "Registers a message to be reacted to.",
                    options: [
                        new CommandOption({
                            name: "message_id",
                            description: "The ID for the message.",
                            required: true,
                        }),
                    ],
                }),
                UnregisterMessage: new Command({
                    name: "unregister_message",
                    description: "Unregisters a message to be reacted to.",
                    options: [
                        new CommandOption({
                            name: "message_id",
                            description: "The ID for the message.",
                            required: true,
                        }),
                    ],
                }),
            },
            execute: (interaction) => this.commandResolver(interaction),
        }),
    ];
    commandResolverKeys = {
        "role_manager.revoke_role": this.revokeRole.bind(this),
        "role_manager.register_message": this.registerMessage.bind(this),
        "role_manager.unregister_message": this.unregisterMessage.bind(this),
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