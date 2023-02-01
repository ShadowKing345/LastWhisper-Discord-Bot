import { PermissionManagerService } from "../services/permissionManager.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Logger } from "../config/index.js";
import { CommandResolverError } from "../utils/errors/index.js";

/**
 * Base class for a module.
 */
export abstract class Module {
  public readonly moduleName: string = "Module";

  protected readonly commandResolverKeys: { [name: string]: (interaction: ChatInputCommandInteraction, ...args: unknown[]) => Promise<InteractionResponse | void> } = {};

  protected constructor(
    protected logger: Logger,
    public permissionManagerService: PermissionManagerService,
  ) {
  }

  protected async commandResolver(interaction: ChatInputCommandInteraction, call = true) {
    this.logger.debug(`Command invoked, dealing with subcommand options.`);

    const command = [
      interaction.commandName,
      interaction.options.getSubcommandGroup(),
      interaction.options.getSubcommand(),
    ]
      .filter(item => item)
      .join(".");
    const f = this.commandResolverKeys[command];

    if (!f) {
      const error = new CommandResolverError("No command found with this name.");
      this.logger.error(error);
      throw error;
    }

    return call ? f(interaction) : f;
  }
}
