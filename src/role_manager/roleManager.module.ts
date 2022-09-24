import { CommandInteraction } from "discord.js";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { addCommandKeys, authorize } from "../permission_manager/index.js";
import { createLogger } from "../utils/logger/logger.decorator.js";
import { Client } from "../utils/models/client.js";
import { ModuleBase } from "../utils/models/index.js";
import { RoleManagerService } from "./roleManager.service.js";

@singleton()
export class RoleManagerModule extends ModuleBase {
    @addCommandKeys()
    private static readonly commands = {
        $index: "role_manager",
        RevokeRole: "revoke_role",
        RegisterMessage: "register_message",
        UnregisterMessage: "unregister_message",
    };

    constructor(
        private roleManagerService: RoleManagerService,
        @createLogger(RoleManagerModule.name) private logger: pino.Logger,
    ) {
        super();

        this.moduleName = "RoleManager";
        this.listeners = [
            { event: "ready", run: async (client) => this.onReady(client) },
        ];
        this.commands = [
            {
                command: builder => builder
                    .setName(RoleManagerModule.commands.$index)
                    .setDescription("Manages roles within a guild.")
                    .addSubcommand(sBuilder => sBuilder
                        .setName(RoleManagerModule.commands.RevokeRole)
                        .setDescription("Revokes the role for all uses."),
                    )
                    .addSubcommand(sBuilder => sBuilder
                        .setName(RoleManagerModule.commands.RegisterMessage)
                        .setDescription("Registers a message to be reacted to.")
                        .addStringOption(iBuilder => iBuilder
                            .setName("message_id")
                            .setDescription("The ID for the message.")
                            .setRequired(true),
                        ),
                    )
                    .addSubcommand(sBuilder => sBuilder
                        .setName(RoleManagerModule.commands.UnregisterMessage)
                        .setDescription("Unregisters a message to be reacted to.")
                        .addStringOption(iBuilder => iBuilder
                            .setName("message_id")
                            .setDescription("The ID for the message.")
                            .setRequired(true),
                        ),
                    ),
                run: interaction => this.subcommandResolver(interaction),
            },
        ];
    }

    private onReady(client: Client): Promise<void> {
        return this.roleManagerService.onReady(client);
    }

    private subcommandResolver(interaction: CommandInteraction): Promise<void> {
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

    @authorize(RoleManagerModule.commands.$index, RoleManagerModule.commands.RevokeRole)
    private revokeRole(interaction: CommandInteraction): Promise<void> {
        return this.roleManagerService.revokeRole(interaction);
    }

    @authorize(RoleManagerModule.commands.$index, RoleManagerModule.commands.RegisterMessage)
    private registerMessage(interaction: CommandInteraction): Promise<void> {
        return this.roleManagerService.registerMessage(interaction);
    }

    @authorize(RoleManagerModule.commands.$index, RoleManagerModule.commands.UnregisterMessage)
    private unregisterMessage(interaction: CommandInteraction): Promise<void> {
        return this.roleManagerService.unregisterMessage(interaction);
    }
}
