import { CommandInteraction, Role, ChatInputCommandInteraction, InteractionResponse, ApplicationCommandOptionType } from "discord.js";

import { ModuleBase } from "../utils/models/index.js";
import { PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilders, CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";

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
                        PermissionManagerModule.commandKeyHelperBuilder(true),
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
                        PermissionManagerModule.commandKeyHelperBuilder(true),
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
                        PermissionManagerModule.commandKeyHelperBuilder(true),
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
                        PermissionManagerModule.commandKeyHelperBuilder(true),
                    ],
                },
            },
            execute: interaction => this.commandResolver(interaction),
        }),
    ];

    protected commandResolverKeys: { [key: string]: Function } = {
        "permission.list": this.listPermissions,
        "permission.add_role": this.addRoles,
        "permission.remove_role": this.removeRoles,
        "permission.set_config": this.config,
        "permission.reset": this.reset,
    };

    constructor(
        permissionManagerService: PermissionManagerService,
        @createLogger(PermissionManagerModule.name) logger: pino.Logger,
    ) {
        super(permissionManagerService, logger);
    }

    protected async commandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
        const f: Function = await super.commandResolver(interaction, false) as Function;

        const key = interaction.options.getString("key");
        const role = interaction.options.getRole("role");

        return f(interaction, key, role);
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
            type: ApplicationCommandOptionType.Boolean,
        });
    }
}
