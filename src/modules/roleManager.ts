import { InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";

import { ModuleBase } from "../utils/models/index.js";
import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { RoleManagerService } from "../services/roleManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { registerModule } from "../utils/decorators/index.js";
import { Commands, Command, CommandOption } from "../utils/objects/command.js";
import { EventListeners, EventListener } from "../utils/objects/eventListener.js";

@registerModule()
export class RoleManagerModule extends ModuleBase {
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

  private onReady(client: Client): Promise<void> {
    return this.roleManagerService.onReady(client);
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
