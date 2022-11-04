import { Timers } from "./timer.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
import { EventListeners } from "./eventListener.js";
import { Commands, Command } from "./command.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { CommandResolverError } from "../errors/commandResolverError.js";
import { pino } from "pino";

/**
 * Base class for a module.
 */
export abstract class ModuleBase {
  public moduleName = "";
  public commands: Commands = [];
  public eventListeners: EventListeners = [];
  public timers: Timers = [];

  public buttons: {
    [key: string]: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
  } = null;
  public selectMenus: {
    [key: string]: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
  } = null;
  public modalSubmits: {
    [key: string]: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
  } = null;

  protected commandResolverKeys: {
    [key: string]: (...args) => Promise<InteractionResponse | void>;
  } = {};

  protected constructor(public permissionManagerService: PermissionManagerService, protected logger: pino.Logger) {}

  /**
   * Method to resolve a slash command call from the discord client.
   * Will throw an error if the function was not found.
   * @param interaction Interaction object.
   * @param call Flag to set if the object should be called or just returned.
   * @throws Error
   * @protected
   */
  protected commandResolver(interaction: ChatInputCommandInteraction, call = true) {
    this.logger.debug(`Command invoked, dealing with subcommand options.`);

    const command = [
      interaction.commandName,
      interaction.options.getSubcommandGroup(),
      interaction.options.getSubcommand(),
    ]
      .filter((item) => item)
      .join(".");
    const f = this.commandResolverKeys[command];

    if (!f) {
      const error = new CommandResolverError("No command found with this name.");
      this.logger.error(error.stack);
      throw error;
    }

    return call ? f(interaction) : f;
  }

  /**
   * Checks if the command with a given name is contained inside this object.
   * @param command The name of the command.
   */
  public hasCommand(command: string): boolean {
    if (!this.handlesCommands) {
      return false;
    }

    return this.commands.find((c) => c.name === command) != null;
  }

  /**
   * Returns the first instance of a command with the given name.
   * @param command The name of the command.
   */
  public getCommand(command: string): Command | undefined {
    if (!this.handlesCommands) {
      return undefined;
    }

    return this.commands.find((c) => c.name === command);
  }

  public get handlesCommands(): boolean {
    return this.commands?.length > 0;
  }

  public get handlesButtons(): boolean {
    return Object.values(this.buttons).length > 0;
  }

  public get handlesSelectMenu(): boolean {
    return Object.values(this.selectMenus).length > 0;
  }
}
