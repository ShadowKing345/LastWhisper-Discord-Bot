import {
  Role,
  ChatInputCommandInteraction,
  InteractionResponse,
  ApplicationCommandOptionType,
} from "discord.js";

import { ModuleBase } from "../utils/models/index.js";
import { PermissionMode } from "../models/permission_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Commands, Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
import { addPermissionKeys } from "../utils/decorators/addPermissionKeys.js";
import { authorize } from "../utils/decorators/authorize.js";

/**
 * Module to manager the permissions of commands from a Discord client.
 * @see PermissionManagerService
 */
@registerModule()
export class PermissionManagerModule extends ModuleBase {
  @addPermissionKeys()
  public static permissionKeys = {
    list: "PermissionManager.list",
    addRole: "PermissionManager.addRole",
    removeRole: "PermissionManager.removeRole",
    config: "PermissionManager.config",
    reset: "PermissionManager.reset",
  };

  public moduleName = "PermissionManager";
  public commands: Commands = [
    new Command({
      name: "permissions",
      description: "Controls the permission for each command.",
      subcommands: {
        List: new Command({
          name: "list",
          description: "Lists out all permissions.",
          options: [PermissionManagerModule.commandKeyHelperBuilder(false)],
        }),
        AddRole: new Command({
          name: "add_role",
          description: "Adds a role to a permission setting.",
          options: [
            PermissionManagerModule.commandKeyHelperBuilder(true),
            new CommandOption({
              name: "role",
              description: "Role to be added.",
              required: true,
              type: ApplicationCommandOptionType.Role,
            }),
          ],
        }),
        RemoveRole: new Command({
          name: "remove_role",
          description: "Removes a role to a permission setting.",
          options: [
            PermissionManagerModule.commandKeyHelperBuilder(true),
            new CommandOption({
              name: "role",
              description: "Role to be added.",
              required: true,
              type: ApplicationCommandOptionType.Role,
            }),
          ],
        }),
        Config: new Command({
          name: "set_config",
          description: "Configures a permission.",
          options: [
            PermissionManagerModule.commandKeyHelperBuilder(true),
            new CommandOption({
              name: "mode",
              description:
                "Sets the search mode for the command. Any: has any. Strict: has all.",
              required: true,
              choices: [
                { name: "any", value: PermissionMode.ANY },
                { name: "strict", value: PermissionMode.STRICT },
              ],
              type: ApplicationCommandOptionType.Integer,
            }),
            new CommandOption({
              name: "black_list",
              description:
                "Reverses the final result. I.e. If list is empty, no one can use the command.",
              type: ApplicationCommandOptionType.String,
            }),
          ],
        }),
        Reset: new Command({
          name: "reset",
          description: "Resets a permission to the default parameters.",
          options: [PermissionManagerModule.commandKeyHelperBuilder(true)],
        }),
      },
      execute: this.commandResolver.bind(this),
    }),
  ];

  protected commandResolverKeys = {
    "permissions.list": this.listPermissions.bind(this),
    "permissions.add_role": this.addRoles.bind(this),
    "permissions.remove_role": this.removeRoles.bind(this),
    "permissions.set_config": this.config.bind(this),
    "permissions.reset": this.reset.bind(this),
  };

  constructor(
    permissionManagerService: PermissionManagerService,
    @createLogger(PermissionManagerModule.name) logger: pino.Logger
  ) {
    super(permissionManagerService, logger);
  }

  protected async commandResolver(
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse | void> {
    const f = await super.commandResolver(interaction, false);

    const key = interaction.options.getString("key");
    const role = interaction.options.getRole("role");

    if (f instanceof Function) {
      return f(interaction, key, role);
    } else {
      return f;
    }
  }

  @authorize(PermissionManagerModule.permissionKeys.list)
  private listPermissions(
    interaction: ChatInputCommandInteraction,
    key?: string
  ): Promise<InteractionResponse> {
    this.logger.debug("Requested listed permissions.");
    return this.permissionManagerService.listPermissions(interaction, key);
  }

  @authorize(PermissionManagerModule.permissionKeys.addRole)
  private addRoles(
    interaction: ChatInputCommandInteraction,
    key: string,
    role: Role
  ): Promise<InteractionResponse> {
    this.logger.debug("Requested add role.");
    return this.permissionManagerService.addRole(interaction, key, role);
  }

  @authorize(PermissionManagerModule.permissionKeys.removeRole)
  private removeRoles(
    interaction: ChatInputCommandInteraction,
    key: string,
    role: Role
  ): Promise<InteractionResponse> {
    this.logger.debug("Requested remove role.");
    return this.permissionManagerService.removeRole(interaction, key, role);
  }

  @authorize(PermissionManagerModule.permissionKeys.config)
  private config(
    interaction: ChatInputCommandInteraction,
    key: string
  ): Promise<InteractionResponse> {
    this.logger.debug("Requested config.");
    return this.permissionManagerService.config(interaction, key);
  }

  @authorize(PermissionManagerModule.permissionKeys.reset)
  private reset(
    interaction: ChatInputCommandInteraction,
    key: string
  ): Promise<InteractionResponse> {
    this.logger.debug("Requested reset.");
    return this.permissionManagerService.reset(interaction, key);
  }

  private static commandKeyHelperBuilder(boolOverride = true): CommandOption {
    return new CommandOption({
      name: "key",
      description: "Command permission Key.",
      required: boolOverride,
      type: ApplicationCommandOptionType.String,
    });
  }
}
