import { ButtonInteraction, ClientEvents, CommandInteraction, ComponentType, Interaction } from "discord.js";
import { clearInterval } from "timers";
import { container } from "tsyringe";
import { Module } from "../modules/module.js";
import { CommandResolverError } from "../utils/errors/index.js";
import { Bot } from "../objects/bot.js";
import { EventListener, SlashCommand, Timer } from "../objects/index.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { ModuleConfiguration } from "./entities/index.js";

import { Logger } from "./logger.js";
import { CTR } from "../utils/commonTypes.js";
import { DatabaseService } from "./databaseService.js";
import { isRejectedPromise } from "../utils/index.js";

type CommandStruct<T> = { type: CTR<Module>, value: T }

/**
 * Todo: Separate concerns to the interaction function.
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
export class ModuleService {
  private static readonly moduleServiceLogger = new Logger(ModuleService.name);
  private static slashCommands: Record<string, CommandStruct<SlashCommand>> = {};
  private static eventListeners: Record<string, CommandStruct<EventListener>[]> = {};
  private static timers: CommandStruct<Timer>[] = [];
  private readonly intervalIds: number[] = [];
  private readonly taskLogger: Logger = new Logger("TimerExecution");

  constructor(
    private readonly moduleConfiguration: ModuleConfiguration = ConfigurationService.getConfiguration(CommonConfigurationKeys.MODULE, ModuleConfiguration),
  ) {
  }

  /**
   * Callback function when a general event other than the interaction event is called.
   * @param listeners A collection of all the listeners to this event.
   * @param client The main application client. Not to be confused with Discord.Js Client.
   * @param args Any additional arguments provided to the event.
   * @private
   */
  private async runEvent(listeners: CommandStruct<EventListener>[], client: Bot, args: unknown[]): Promise<void> {
    const childContainer = container.createChildContainer();
    const dbService = childContainer.resolve(DatabaseService);
    await dbService.connect();

    const results = await Promise.allSettled(
      listeners.map(struct => {
        const obj = childContainer.resolve(struct.type);
        return struct.value.execute.apply(obj, [client, args]);
      }),
    );

    await dbService.disconnect();

    for (const result of results) {
      if (isRejectedPromise(result)) {
        ModuleService.moduleServiceLogger.error(result.reason);
      }
    }
  }

  /**
   * Todo: Setup modal responding.
   * Todo: Setup buttons/select menu
   * Todo: Context Menu.
   * The main interaction event callback function that is called when a Discord interaction event is called.
   * @param interaction The interaction data object.
   * @private
   */
  private async interactionEvent(interaction: Interaction): Promise<void> {
    ModuleService.moduleServiceLogger.debug("Interaction event invoked.");

    try {
      if (interaction.isCommand()) {
        ModuleService.moduleServiceLogger.debug("Interaction is a command.");

        if (interaction.isContextMenuCommand()) {
          ModuleService.moduleServiceLogger.debug(
            `Interaction is a ${interaction.isUserContextMenuCommand() ? "user" : "message"} context menu.`,
          );

          if (interaction.isUserContextMenuCommand()) {
            await interaction.reply({
              content: "Responded with a user",
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: "Responded with a message",
              ephemeral: true,
            });
          }
        }

        if (interaction.isChatInputCommand() && this.moduleConfiguration.enableCommands) {
          ModuleService.moduleServiceLogger.debug("Interaction is a chat input command. (Slash command.)");

          // Edge case if somehow a command can be invoked inside a DM.
          if (!interaction.guildId) {
            ModuleService.moduleServiceLogger.debug("Warning! Command invoked outside of a guild. Exiting");
            return;
          }

          const commandStruct = ModuleService.slashCommands[interaction.commandName];
          if (!commandStruct) {
            ModuleService.moduleServiceLogger.error(`No command found with name: ${interaction.commandName}. Exiting`);
            return;
          }

          await this.callCallback(commandStruct.type, commandStruct.value.callback, [interaction]);
        }
      } else {
        ModuleService.moduleServiceLogger.debug("Interaction is not a command.");

        if (interaction.isModalSubmit()) {
          await interaction.reply({ content: "Responded", ephemeral: true });
        }

        if (interaction.isMessageComponent()) {
          switch (interaction.componentType) {
            case ComponentType.Button:
              break;
            case ComponentType.StringSelect:
              break;
            default:
              break;
          }
        }
      }
    } catch (error) {
      ModuleService.moduleServiceLogger.error(error);

      if (
        interaction &&
        (interaction instanceof ButtonInteraction || interaction instanceof CommandInteraction) &&
        !interaction.replied
      ) {
        if (error instanceof CommandResolverError) {
          await interaction.reply({
            content: "Sorry there was an issue resolving the command name.",
            ephemeral: true,
          });
          return;
        }

        if (interaction.deferred) {
          await interaction.editReply({
            content: "There was an internal error that occurred when using this interaction.",
          });
        } else {
          await interaction.reply({
            content: "There was an internal error that occurred when using this interaction.",
            ephemeral: true,
          });
        }
      }
    }
  }

  /**
   * Function that sets up a Javascript timer to go off.
   * Also fires the timer as well.
   * @param timerStruct The type struct that contains the timer and module type.
   * @param client The main app client. Not to be confused with Discord.Js Client object.
   * @private
   */
  private runTimer(timerStruct: CommandStruct<Timer>, client: Bot): void {
    try {
      this.intervalIds.push(
        setInterval(() => {
            this.callCallback(timerStruct.type, timerStruct.value.execute, [client])
              .then()
              .catch(error => this.taskLogger.error(error));
          },
          timerStruct.value.timeout,
          client,
        ),
      );

      this.callCallback(timerStruct.type, timerStruct.value.execute, [client])
        .then()
        .catch(error => this.taskLogger.error(error));
    } catch (error) {
      this.taskLogger.error(error);
    }
  }

  /**
   * Configures a client with all the necessary module and callback information.
   * Registers events, timers, commands, etc...
   * @param client The main app client. Not to be confused with Discord.Js Client object.
   */
  public configureModules(client: Bot): void {
    ModuleService.moduleServiceLogger.info("Loading modules.");

    if (this.moduleConfiguration.enableEventListeners) {
      ModuleService.moduleServiceLogger.debug("Registering event.");
      for (const eventName in ModuleService.eventListeners) {
        client.on(eventName, (...args) => this.runEvent(ModuleService.eventListeners[eventName], client, args));
      }
    }

    if (this.moduleConfiguration.enableTimers) {
      ModuleService.moduleServiceLogger.debug("Timers were enabled.");
      for (const timer of ModuleService.timers) {
        this.runTimer(timer, client);
      }
    }

    if (this.moduleConfiguration.enableInteractions) {
      ModuleService.moduleServiceLogger.debug("Interactions were enabled.");
      client.on("interactionCreate", this.interactionEvent.bind(this));
    }

    ModuleService.moduleServiceLogger.info("Done.");
  }

  /**
   * Cleanup function.
   */
  public cleanup() {
    ModuleService.moduleServiceLogger.info(`Cleaning up module configurations.`);
    for (const id of this.intervalIds) {
      clearInterval(id);
    }
  }

  /**
   * Calls a callback with the necessary steps first.
   * @param type The type data for the container to resolve.
   * @param callback The callback to be called using the resolved object.
   * @param args Any additional arguments to be provided to the callback.
   * @private
   */
  private async callCallback(type: CTR<Module>, callback: (...args) => unknown | void, args: unknown[]): Promise<unknown> {
    const childContainer = container.createChildContainer();

    const dbService = childContainer.resolve(DatabaseService);
    await dbService.connect();
    const obj = childContainer.resolve(type);
    const result = await callback.apply(obj, args);
    await dbService.disconnect();

    return result;
  }

  // region Static Method

  public static registerSlashCommand(command: SlashCommand, type: CTR<Module>) {
    ModuleService.slashCommands[command.name] = { value: command, type };
  }

  public static getSlashCommands(): CommandStruct<SlashCommand>[] {
    return Object.values(ModuleService.slashCommands);
  }

  public static registerEventListener(listener: EventListener, type: CTR<Module>) {
    const eventName = listener.event as keyof ClientEvents;

    if (!(eventName in ModuleService.eventListeners)) {
      ModuleService.eventListeners[eventName] = [];
    }

    ModuleService.eventListeners[eventName].push({ value: listener, type });
  }

  public static getEventListeners(): CommandStruct<EventListener>[] {
    return Object.values(ModuleService.eventListeners).reduce((prev, current) => {
      prev.push(...current);
      return prev;
    }, []);
  }

  public static registerTimer(timer: Timer, type: CTR<Module>) {
    ModuleService.timers.push({ value: timer, type });
  }

  public static getTimers(): CommandStruct<Timer>[] {
    return ModuleService.timers;
  }

  // endregion
}
