import { InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";

import { EventListener, ModuleBase } from "../utils/models/index.js";
import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { RoleManagerService } from "../services/roleManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilders, CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";

@registerModule()
export class RoleManagerModule extends ModuleBase {
    public moduleName: string = "RoleManager";
    public listeners: EventListener[] = [
        { event: "ready", run: async (client) => this.onReady(client) },
    ];
    public commands: CommandBuilders = [
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
            execute: interaction => this.subcommandResolver(interaction as ChatInputCommandInteraction),
        }),
    ];

    constructor(
        private roleManagerService: RoleManagerService,
        @createLogger(RoleManagerModule.name) private logger: pino.Logger,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService);
    }

    private onReady(client: Client): Promise<void> {
        return this.roleManagerService.onReady(client);
    }

    private subcommandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
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

    private revokeRole(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.roleManagerService.revokeRole(interaction);
    }

    private registerMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.roleManagerService.registerMessage(interaction);
    }

    private unregisterMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.roleManagerService.unregisterMessage(interaction);
    }
}
