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
var PermissionManagerModule_1;
import { ApplicationCommandOptionType } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
let PermissionManagerModule = PermissionManagerModule_1 = class PermissionManagerModule extends ModuleBase {
    moduleName = "PermissionManager";
    commands = [
        new CommandBuilder({
            name: "permission",
            description: "Controls the permission for each command.",
            subcommands: {
                List: {
                    name: "list",
                    description: "Lists out all permissions.",
                    options: [
                        PermissionManagerModule_1.commandKeyHelperBuilder(false),
                    ],
                },
                AddRole: {
                    name: "add_role",
                    description: "Adds a role to a permission setting.",
                    options: [
                        PermissionManagerModule_1.commandKeyHelperBuilder(true),
                        new CommandBuilderOption({
                            name: "role",
                            description: "Role to be added.",
                            required: true,
                            type: ApplicationCommandOptionType.Role,
                        }),
                    ],
                },
                RemoveRole: {
                    name: "remove_role",
                    description: "Removes a role to a permission setting.",
                    options: [
                        PermissionManagerModule_1.commandKeyHelperBuilder(true),
                        new CommandBuilderOption({
                            name: "role",
                            description: "Role to be added.",
                            required: true,
                            type: ApplicationCommandOptionType.Role,
                        }),
                    ],
                },
                Config: {
                    name: "set_config",
                    description: "Configures a permission.",
                    options: [
                        PermissionManagerModule_1.commandKeyHelperBuilder(true),
                        new CommandBuilderOption({
                            name: "mode",
                            description: "Sets the search mode for the command. Any: has any. Strict: has all.",
                            required: true,
                            choices: [
                                { name: "any", value: PermissionMode.ANY },
                                { name: "strict", value: PermissionMode.STRICT },
                            ],
                            type: ApplicationCommandOptionType.Integer,
                        }),
                        new CommandBuilderOption({
                            name: "black_list",
                            description: "Reverses the final result. I.e. If list is empty, no one can use the command.",
                            type: ApplicationCommandOptionType.String,
                        }),
                    ],
                },
                Reset: {
                    name: "reset",
                    description: "Resets a permission to the default parameters.",
                    options: [
                        PermissionManagerModule_1.commandKeyHelperBuilder(true),
                    ],
                },
            },
            execute: interaction => this.commandResolver(interaction),
        }),
    ];
    commandResolverKeys = {
        "permission.list": this.listPermissions,
        "permission.add_role": this.addRoles,
        "permission.remove_role": this.removeRoles,
        "permission.set_config": this.config,
        "permission.reset": this.reset,
    };
    constructor(permissionManagerService, logger) {
        super(permissionManagerService, logger);
    }
    async commandResolver(interaction) {
        const f = await super.commandResolver(interaction, false);
        const key = interaction.options.getString("key");
        const role = interaction.options.getRole("role");
        return f(interaction, key, role);
    }
    listPermissions(interaction, key) {
        return this.permissionManagerService.listPermissions(interaction, key);
    }
    addRoles(interaction, key, role) {
        return this.permissionManagerService.addRole(interaction, key, role);
    }
    removeRoles(interaction, key, role) {
        return this.permissionManagerService.removeRole(interaction, key, role);
    }
    config(interaction, key) {
        return this.permissionManagerService.config(interaction, key);
    }
    reset(interaction, key) {
        return this.permissionManagerService.reset(interaction, key);
    }
    static commandKeyHelperBuilder(boolOverride = true) {
        return new CommandBuilderOption({
            name: "key",
            description: "Command permission Key.",
            required: boolOverride,
            type: ApplicationCommandOptionType.Boolean,
        });
    }
};
PermissionManagerModule = PermissionManagerModule_1 = __decorate([
    registerModule(),
    __param(1, createLogger(PermissionManagerModule_1.name)),
    __metadata("design:paramtypes", [PermissionManagerService, Object])
], PermissionManagerModule);
export { PermissionManagerModule };
//# sourceMappingURL=permissionManager.module.js.map