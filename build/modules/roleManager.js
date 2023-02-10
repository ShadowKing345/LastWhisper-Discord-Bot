var RoleManagerModule_1;
import { __decorate, __metadata } from "tslib";
import { Module } from "./module.js";
import { RoleManagerService } from "../services/roleManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { module } from "../decorators/index.js";
import { CommandOption, EventListener, SlashCommand } from "../objects/index.js";
import { Logger } from "../config/logger.js";
let RoleManagerModule = RoleManagerModule_1 = class RoleManagerModule extends Module {
    roleManagerService;
    static logger = new Logger("RoleManagerModule");
    moduleName = "RoleManager";
    eventListeners = [new EventListener("ready", async (client) => this.onReady(client))];
    commands = [
        new SlashCommand({
            name: "role_manager",
            description: "Manages roles within a guild.",
            subcommands: {
                RevokeRole: new SlashCommand({
                    name: "revoke_role",
                    description: "Revokes the role for all uses.",
                }),
                RegisterMessage: new SlashCommand({
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
                UnregisterMessage: new SlashCommand({
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
            callback: interaction => this.commandResolver(interaction),
        }),
    ];
    commandResolverKeys = {
        "role_manager.revoke_role": this.revokeRole.bind(this),
        "role_manager.register_message": this.registerMessage.bind(this),
        "role_manager.unregister_message": this.unregisterMessage.bind(this),
    };
    constructor(roleManagerService, permissionManagerService) {
        super(RoleManagerModule_1.logger, permissionManagerService);
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
    module(),
    __metadata("design:paramtypes", [RoleManagerService,
        PermissionManagerService])
], RoleManagerModule);
export { RoleManagerModule };
//# sourceMappingURL=roleManager.js.map