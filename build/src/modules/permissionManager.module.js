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
import { injectable } from "tsyringe";
import { ModuleBase } from "../classes/moduleBase.js";
import { PermissionMode } from "../models/permissionManagerConfig.model.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { addCommandKeys } from "../utils/addCommandKeys.js";
let PermissionManagerModule = PermissionManagerModule_1 = class PermissionManagerModule extends ModuleBase {
    permissionManagerService;
    static commands = {
        $index: "permission",
        List: "list_permissions",
        AddRole: "add_role",
        RemoveRole: "remove_role",
        Config: "set_config",
        Reset: "reset_permission",
    };
    constructor(permissionManagerService) {
        super();
        this.permissionManagerService = permissionManagerService;
        this.moduleName = "PermissionManager";
        this.commands = [{
                command: builder => builder
                    .setName(PermissionManagerModule_1.commands.$index)
                    .setDescription("Controls the permission for each command.")
                    .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule_1.commands.List)
                    .setDescription("Lists out all permissions.")
                    .addStringOption(input => PermissionManagerModule_1.commandKeyHelperBuilder(input, false)))
                    .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule_1.commands.AddRole)
                    .setDescription("Adds a role to a permission setting.")
                    .addStringOption(input => PermissionManagerModule_1.commandKeyHelperBuilder(input))
                    .addRoleOption(input => input
                    .setName("role")
                    .setDescription("Role to be added.")
                    .setRequired(true)))
                    .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule_1.commands.RemoveRole)
                    .setDescription("Removes a role to a permission setting.")
                    .addStringOption(input => PermissionManagerModule_1.commandKeyHelperBuilder(input))
                    .addRoleOption(input => input
                    .setName("role")
                    .setDescription("Role to be removed.")
                    .setRequired(true)))
                    .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule_1.commands.Config)
                    .setDescription("Configures a permission.")
                    .addStringOption(input => PermissionManagerModule_1.commandKeyHelperBuilder(input))
                    .addIntegerOption(input => input
                    .setName("mode")
                    .setDescription("Sets the search mode for the command. Any: has any. Strict: has all.")
                    .addChoices([
                    ["any", PermissionMode.ANY],
                    ["strict", PermissionMode.STRICT],
                ]))
                    .addBooleanOption(input => input
                    .setName("black_list")
                    .setDescription("Reverses the final result. I.e. If list is empty, no one can use the command.")
                    .setRequired(false)))
                    .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule_1.commands.Reset)
                    .setDescription("Resets a permission to the default parameters.")
                    .addStringOption(input => PermissionManagerModule_1.commandKeyHelperBuilder(input))),
                run: interaction => this.subcommandResolver(interaction),
            }];
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
        if (!await this.permissionManagerService.isAuthorized(interaction, `${PermissionManagerModule_1.commands.$index}.${subcommand}`)) {
            return interaction.reply({
                content: "Sorry you do not have permission to use this command.",
                ephemeral: true,
            });
        }
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
    static commandKeyHelperBuilder(input, boolOverride = true) {
        return input.setName("key").setDescription("Command permission Key.").setRequired(boolOverride);
    }
};
__decorate([
    addCommandKeys(),
    __metadata("design:type", Object)
], PermissionManagerModule, "commands", void 0);
PermissionManagerModule = PermissionManagerModule_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [PermissionManagerService])
], PermissionManagerModule);
export { PermissionManagerModule };
//# sourceMappingURL=permissionManager.module.js.map