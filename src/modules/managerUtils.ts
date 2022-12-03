import {
  GuildBan,
  GuildMember,
  ChatInputCommandInteraction,
  InteractionResponse,
  PartialGuildMember,
} from "discord.js";
import { Module } from "../utils/objects/index.js";
import { ManagerUtilsService } from "../services/managerUtils.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { module } from "../utils/decorators/index.js";
import { Command, CommandOption, Commands } from "../utils/objects/command.js";
import { createLogger } from "../services/loggerService.js";
import { pino } from "pino";
import { EventListeners, EventListener } from "../utils/objects/eventListener.js";

/**
 * Module that provides utilities for the managers..
 */
@module()
export class ManagerUtilsModule extends Module {
  public moduleName = "ManagerUtils";
  public commands: Commands = [
    new Command({
      name: "manager_utils",
      description: "Utility functions for managers.",
      subcommands: {
        Clear: new Command({
          name: "clear",
          description: "Clears a channel of its messages.",
          options: [
            new CommandOption({
              name: "amount",
              description: "The amount of messages to clear. Default 10.",
            }),
          ],
        }),
      },
      execute: interaction => this.commandResolver(interaction) as Promise<InteractionResponse | void>,
    }),
  ];
  public eventListeners: EventListeners = [
    new EventListener("guildBanAdd", (_, [member]) => this.onMemberBanned(member)),
    new EventListener("guildMemberRemove", async (_, [member]) => await this.onMemberRemoved(member)),
  ];

  protected commandResolverKeys = {
    "manager_utils.clear": this.clear.bind(this),
  };

  constructor(
    private managerUtilsService: ManagerUtilsService,
    permissionManagerService: PermissionManagerService,
    @createLogger(ManagerUtilsModule.name) logger: pino.Logger,
  ) {
    super(permissionManagerService, logger);
  }

  /**
   * Event that posts a message to a given channel if a user leaves the guild for any reason.
   * @param member Guild member that has left.
   * @private
   */
  private onMemberRemoved(member: GuildMember | PartialGuildMember): Promise<void> {
    return this.managerUtilsService.onMemberRemoved(member);
  }

  /**
   * Event that posts a message when the user is banned from the guild.
   * @see onMemberRemoved
   * @param ban The guild ban object.
   * @private
   */
  private onMemberBanned(ban: GuildBan): Promise<void> {
    return this.managerUtilsService.onMemberBanned(ban);
  }

  /**
   * Command that attempts to clear a channel of messages.
   * @param interaction
   * @private
   */
  private clear(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return this.managerUtilsService.clearChannelMessages(interaction);
  }
}
