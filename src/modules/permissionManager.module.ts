import { CommandInteraction, Role, ChatInputCommandInteraction, InteractionResponse, ApplicationCommandOptionType } from "discord.js";

import { ModuleBase } from "../utils/models/index.js";
import { PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilders, CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";

@registerModule()
export class PermissionManagerModule extends ModuleBase {
    public moduleName: string = "PermissionManager";
    public commands: CommandBuilders = [
        new CommandBuilder({
            name: "permission",
            description: "Controls the permission for each command.",
            subcommands: {
                List: {
                    name: "list",
                    description: "Lists out all permissions.",
                    options: [
                        PermissionManagerModule.commandKeyHelperBuilder(false),
                    ],
                },
                AddRole: {
                    name: "add_role",
                    description: "Adds a role to a permission setting.",
                    options: [
                        PermissionManagerModule.commandKeyHelperBuilder(false),
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
                        PermissionManagerModule.commandKeyHelperBuilder(false),
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
                        PermissionManagerModule.commandKeyHelperBuilder(false),
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
                        PermissionManagerModule.commandKeyHelperBuilder(false),
                    ],
                },
            },
            execute: interaction => this.subcommandResolver(interaction as ChatInputCommandInteraction),
        })
    ];

    constructor(
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService);
    }

    private async subcommandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
        // if (!interaction.guildId) {
        //     return interaction.reply({
        //         content: "This command can only be used inside a server.",
        //         ephemeral: true,
        //     });
        // }
        //
        // const subcommand = interaction.options.getSubcommand();
        // const key: string = interaction.options.getString("key");
        // const role: Role = interaction.options.getRole("role") as Role;
        //
        // switch (subcommand) {
        //     case PermissionManagerModule.commands.List:
        //         return this.listPermissions(interaction, key);
        //     case PermissionManagerModule.commands.AddRole:
        //         return this.addRoles(interaction, key, role);
        //     case PermissionManagerModule.commands.RemoveRole:
        //         return this.removeRoles(interaction, key, role);
        //     case PermissionManagerModule.commands.Config:
        //         return this.config(interaction, key);
        //     case PermissionManagerModule.commands.Reset:
        //         return this.reset(interaction, key);
        //     default:
        //         return interaction.reply({ content: "Cannot find command.", ephemeral: true });
        // }
    }

    private listPermissions(interaction: CommandInteraction, key?: string): Promise<InteractionResponse> {
        return this.permissionManagerService.listPermissions(interaction, key);
    }

    private addRoles(interaction: CommandInteraction, key: string, role: Role): Promise<InteractionResponse> {
        return this.permissionManagerService.addRole(interaction, key, role);
    }

    private removeRoles(interaction: CommandInteraction, key: string, role: Role): Promise<InteractionResponse> {
        return this.permissionManagerService.removeRole(interaction, key, role);
    }

    private config(interaction: CommandInteraction, key: string): Promise<InteractionResponse> {
        return this.permissionManagerService.config(interaction as ChatInputCommandInteraction, key);
    }

    private reset(interaction: CommandInteraction, key: string): Promise<InteractionResponse> {
        return this.permissionManagerService.reset(interaction, key);
    }

    private static commandKeyHelperBuilder(boolOverride = true): CommandBuilderOption {
        return new CommandBuilderOption({
            name: "key",
            description: "Command permission Key.",
            required: boolOverride,
            type: ApplicationCommandOptionType.Boolean
        });
    }
}
