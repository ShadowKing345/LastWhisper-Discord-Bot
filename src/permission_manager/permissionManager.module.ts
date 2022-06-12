import { SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, Role } from "discord.js";
import { injectable } from "tsyringe";

import { ModuleBase } from "../shared/models/moduleBase.js";
import { addCommandKeys } from "./addCommandKeys.js";
import { PermissionMode } from "./models/index.js";
import { PermissionManagerService } from "./permissionManager.service.js";

@injectable()
export class PermissionManagerModule extends ModuleBase {
    @addCommandKeys()
    private static readonly commands = {
        $index: "permission",
        List: "list_permissions",
        AddRole: "add_role",
        RemoveRole: "remove_role",
        Config: "set_config",
        Reset: "reset_permission",
    };

    constructor(private permissionManagerService: PermissionManagerService) {
        super();

        this.moduleName = "PermissionManager";
        this.commands = [ {
            command: builder => builder
                .setName(PermissionManagerModule.commands.$index)
                .setDescription("Controls the permission for each command.")
                .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule.commands.List as string)
                    .setDescription("Lists out all permissions.")
                    .addStringOption(input => PermissionManagerModule.commandKeyHelperBuilder(input, false)),
                )
                .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule.commands.AddRole as string)
                    .setDescription("Adds a role to a permission setting.")
                    .addStringOption(input => PermissionManagerModule.commandKeyHelperBuilder(input))
                    .addRoleOption(input => input
                        .setName("role")
                        .setDescription("Role to be added.")
                        .setRequired(true),
                    ),
                )
                .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule.commands.RemoveRole as string)
                    .setDescription("Removes a role to a permission setting.")
                    .addStringOption(input => PermissionManagerModule.commandKeyHelperBuilder(input))
                    .addRoleOption(input => input
                        .setName("role")
                        .setDescription("Role to be removed.")
                        .setRequired(true),
                    ),
                )
                .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule.commands.Config as string)
                    .setDescription("Configures a permission.")
                    .addStringOption(input => PermissionManagerModule.commandKeyHelperBuilder(input))
                    .addIntegerOption(input => input
                        .setName("mode")
                        .setDescription("Sets the search mode for the command. Any: has any. Strict: has all.")
                        .addChoices([
                            [ "any", PermissionMode.ANY ],
                            [ "strict", PermissionMode.STRICT ],
                        ]),
                    )
                    .addBooleanOption(input => input
                        .setName("black_list")
                        .setDescription("Reverses the final result. I.e. If list is empty, no one can use the command.")
                        .setRequired(false),
                    ),
                )
                .addSubcommand(sBuilder => sBuilder
                    .setName(PermissionManagerModule.commands.Reset as string)
                    .setDescription("Resets a permission to the default parameters.")
                    .addStringOption(input => PermissionManagerModule.commandKeyHelperBuilder(input)),
                ),
            run: interaction => this.subcommandResolver(interaction),
        } ];
    }

    private async subcommandResolver(interaction: CommandInteraction): Promise<void> {
        if (!interaction.guildId) {
            return interaction.reply({
                content: "This command can only be used inside a server.",
                ephemeral: true,
            });
        }

        const subcommand = interaction.options.getSubcommand();
        const key: string = interaction.options.getString("key");
        const role: Role = interaction.options.getRole("role") as Role;

        if (!await this.permissionManagerService.isAuthorized(interaction, `${PermissionManagerModule.commands.$index}.${subcommand}`)) {
            return interaction.reply({
                content: "Sorry you do not have permission to use this command.",
                ephemeral: true,
            });
        }

        switch (subcommand) {
            case PermissionManagerModule.commands.List:
                return this.listPermissions(interaction, key);
            case PermissionManagerModule.commands.AddRole:
                return this.addRoles(interaction, key, role);
            case PermissionManagerModule.commands.RemoveRole:
                return this.removeRoles(interaction, key, role);
            case PermissionManagerModule.commands.Config:
                return this.config(interaction, key);
            case PermissionManagerModule.commands.Reset:
                return this.reset(interaction, key);
            default:
                return interaction.reply({ content: "Cannot find command.", ephemeral: true });
        }
    }

    private listPermissions(interaction: CommandInteraction, key?: string): Promise<void> {
        return this.permissionManagerService.listPermissions(interaction, key);
    }

    private addRoles(interaction: CommandInteraction, key: string, role: Role): Promise<void> {
        return this.permissionManagerService.addRole(interaction, key, role);
    }

    private removeRoles(interaction: CommandInteraction, key: string, role: Role): Promise<void> {
        return this.permissionManagerService.removeRole(interaction, key, role);
    }

    private config(interaction: CommandInteraction, key: string): Promise<void> {
        return this.permissionManagerService.config(interaction, key);
    }

    private reset(interaction: CommandInteraction, key: string): Promise<void> {
        return this.permissionManagerService.reset(interaction, key);
    }

    private static commandKeyHelperBuilder(input: SlashCommandStringOption, boolOverride = true): SlashCommandStringOption {
        return input.setName("key").setDescription("Command permission Key.").setRequired(boolOverride);
    }
}