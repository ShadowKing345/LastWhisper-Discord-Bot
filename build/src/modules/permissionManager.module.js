var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PermissionManagerModule_1;
import { CommandInteraction, Role, ApplicationCommandOptionType } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { addCommandKeys } from "../utils/decorators/addCommandKeys.js";
import { authorize } from "../utils/decorators/authorize.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";
let PermissionManagerModule = PermissionManagerModule_1 = class PermissionManagerModule extends ModuleBase {
    static commands = {
        $index: "permission",
        List: "list_permissions",
        AddRole: "add_role",
        RemoveRole: "remove_role",
        Config: "set_config",
        Reset: "reset_permission",
    };
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
                        PermissionManagerModule_1.commandKeyHelperBuilder(false),
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
                        PermissionManagerModule_1.commandKeyHelperBuilder(false),
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
                        PermissionManagerModule_1.commandKeyHelperBuilder(false),
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
                        PermissionManagerModule_1.commandKeyHelperBuilder(false),
                    ],
                },
            },
            execute: interaction => this.subcommandResolver(interaction),
        })
    ];
    constructor(permissionManagerService) {
        super(permissionManagerService);
    }
    async subcommandResolver(interaction) {
        if (!interaction.guildId) {
            return interaction.reply({
                content: "This command can only be used inside a server.",
                ephemeral: true,
            });
        }
        const subcommand = interaction.options.getSubcommand();
        const key = interaction.options.getString("key");
        const role = interaction.options.getRole("role");
        switch (subcommand) {
            case PermissionManagerModule_1.commands.List:
                return this.listPermissions(interaction, key);
            case PermissionManagerModule_1.commands.AddRole:
                return this.addRoles(interaction, key, role);
            case PermissionManagerModule_1.commands.RemoveRole:
                return this.removeRoles(interaction, key, role);
            case PermissionManagerModule_1.commands.Config:
                return this.config(interaction, key);
            case PermissionManagerModule_1.commands.Reset:
                return this.reset(interaction, key);
            default:
                return interaction.reply({ content: "Cannot find command.", ephemeral: true });
        }
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
            type: ApplicationCommandOptionType.Boolean
        });
    }
};
__decorate([
    authorize(PermissionManagerModule_1.commands.$index, PermissionManagerModule_1.commands.List),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction, String]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "listPermissions", null);
__decorate([
    authorize(PermissionManagerModule_1.commands.$index, PermissionManagerModule_1.commands.AddRole),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction, String, Role]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "addRoles", null);
__decorate([
    authorize(PermissionManagerModule_1.commands.$index, PermissionManagerModule_1.commands.RemoveRole),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction, String, Role]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "removeRoles", null);
__decorate([
    authorize(PermissionManagerModule_1.commands.$index, PermissionManagerModule_1.commands.Config),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction, String]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "config", null);
__decorate([
    authorize(PermissionManagerModule_1.commands.$index, PermissionManagerModule_1.commands.Reset),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction, String]),
    __metadata("design:returntype", Promise)
], PermissionManagerModule.prototype, "reset", null);
__decorate([
    addCommandKeys(),
    __metadata("design:type", Object)
], PermissionManagerModule, "commands", void 0);
PermissionManagerModule = PermissionManagerModule_1 = __decorate([
    registerModule(),
    __metadata("design:paramtypes", [PermissionManagerService])
], PermissionManagerModule);
export { PermissionManagerModule };
//# sourceMappingURL=permissionManager.module.js.map