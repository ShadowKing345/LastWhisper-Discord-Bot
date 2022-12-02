import { InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";

import { Module } from "../utils/models/index.js";
import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { RoleManagerService } from "../services/roleManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { module } from "../utils/decorators/index.js";
import { Commands, Command, CommandOption } from "../utils/objects/command.js";
import { EventListeners, EventListener } from "../utils/objects/eventListener.js";

/**
 * Module for managing the roles of a Guild.
 * This module provides a simple apply for role scenario where users are give a role based on context.
 */
@module()
export class RoleManagerModule extends Module {
  public moduleName = "RoleManager";
  public eventListeners: EventListeners = [new EventListener("ready", async client => this.onReady(client))];
  public commands: Commands = [
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
      execute: interaction => this.commandResolver(interaction) as Promise<InteractionResponse | void>,
    }),
  ];

  protected commandResolverKeys = {
    "role_manager.revoke_role": this.revokeRole.bind(this),
    "role_manager.register_message": this.registerMessage.bind(this),
    "role_manager.unregister_message": this.unregisterMessage.bind(this),
  };

  constructor(
    private roleManagerService: RoleManagerService,
    @createLogger(RoleManagerModule.name) logger: pino.Logger,
    permissionManagerService: PermissionManagerService,
  ) {
    super(permissionManagerService, logger);
  }

  /**
   * On ready event to set up reaction listeners.
   * @param client The Discord Client.
   * @private
   */
  private onReady(client: Client): Promise<void> {
    return this.roleManagerService.onReady(client);
  }

  /**
   * Removes authorized role from all users. Effectively resetting permissions.
   * @param interaction The Discord interaction.
   * @private
   */
  private revokeRole(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
    return this.roleManagerService.revokeRole(interaction);
  }

  /**
   * Registers a message to be listened to.
   * @param interaction The Discord interaction.
   * @private
   */
  private registerMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
    return this.roleManagerService.registerMessage(interaction);
  }

  /**
   * Unregisters a message that is being listened to.
   * @param interaction The Discord interaction.
   * @private
   */
  private unregisterMessage(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
    return this.roleManagerService.unregisterMessage(interaction);
  }
}
