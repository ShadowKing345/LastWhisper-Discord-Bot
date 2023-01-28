import { ButtonInteraction, CommandInteraction, ComponentType, Interaction } from "discord.js";
import { clearInterval } from "timers";
import { container } from "tsyringe";
import { Module } from "../modules/module.js";
import { CommandResolverError } from "../utils/errors/index.js";
import { Bot } from "../objects/bot.js";
import { EventListeners, SlashCommand, SlashCommands } from "../objects/index.js";
import { Timer } from "../objects/timer.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { ModuleConfiguration } from "./entities/index.js";

import { Logger } from "./logger.js";

/**
 * Todo: Remove the multiple loggers
 * Todo: Add scoped to interactions.
 * Todo: Separate concerns to the interaction function.
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
export class ModuleService {
  private static commands: Record<string, SlashCommands> = {};

  private readonly intervalIds: number[] = [];
  private readonly moduleLogger: Logger = new Logger("ModuleConfiguration");
  private readonly interactionLogger: Logger = new Logger("InteractionExecution");
  private readonly eventLogger: Logger = new Logger("EventExecution");
  private readonly taskLogger: Logger = new Logger("TimerExecution");

  constructor(
    private readonly moduleConfiguration: ModuleConfiguration = ConfigurationService.getConfiguration(CommonConfigurationKeys.MODULE, ModuleConfiguration),
  ) {
  }

  /**
   * List of all modules registered.
   */
  public get filteredModules(): Module[] {
    console.log(ModuleService.commands);

    const modules: Module[] = container.resolveAll(Module.name);

    if (this.moduleConfiguration.modules?.length !== 0) {
      return modules.filter(module => {
        const inList = this.moduleConfiguration.modules?.includes(module.moduleName);
        const blacklist = this.moduleConfiguration.blacklist;
        return (!blacklist && inList) || (blacklist && !inList);
      });
    }

    return modules;
  }

  /**
   * Callback function when a general event other than the interaction event is called.
   * @param listeners A collection of all the listeners to this event.
   * @param client The main application client. Not to be confused with Discord.Js Client.
   * @param args Any additional arguments provided to the event.
   * @private
   */
  private async runEvent(listeners: EventListeners, client: Bot, ...args): Promise<void> {
    const results = await Promise.allSettled(
      listeners.map(
        listener =>
          new Promise((resolve, reject) => {
            try {
              resolve(listener.execute(client, args));
            } catch (error) {
              reject(error);
            }
          }),
      ),
    );

    for (const result of results.filter(result => result.status === "rejected") as PromiseRejectedResult[]) {
      this.eventLogger.error(result.reason instanceof Error ? result.reason.stack : result.reason);
    }
  }

  /**
   * Function that sets up a Javascript timer to go off.
   * Also fires the timer as well.
   * @param timer The timer object data used to create a timer.
   * @param client The main app client. Not to be confused with Discord.Js Client object.
   * @private
   */
  private runTimer(timer: Timer, client: Bot): void {
    try {
      this.intervalIds.push(
        setInterval(
          () => {
            timer.execute(client).catch(error => this.taskLogger.error(error instanceof Error ? error.stack : error));
          },
          timer.timeout,
          client,
        ),
      );
      timer.execute(client).catch(error => this.taskLogger.error(error instanceof Error ? error.stack : error));
    } catch (error) {
      this.taskLogger.error(error instanceof Error ? error.stack : error);
    }
  }

  /**
   * Configures a client with all the necessary module and callback information.
   * Registers events, timers, commands, etc...
   * @param client The main app client. Not to be confused with Discord.Js Client object.
   */
  public configureModules(client: Bot): void {
    this.moduleLogger.info("Loading modules.");
    const modules = this.filteredModules;

    this.moduleLogger.debug(`Loaded modules: ${JSON.stringify(modules.map(module => module.moduleName))}.`);

    if (this.moduleConfiguration.enableCommands) {
      this.moduleLogger.debug("Commands enabled.");
    }

    for (const module of modules) {
      this.moduleLogger.info(module.moduleName);

      try {
        if (this.moduleConfiguration.enableEventListeners) {
          this.moduleLogger.debug("Setting up event module events.");

          for (const listener of module.eventListeners) {
            // FixMe: Get rid of these eslint disable statement.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const collection: EventListeners = client.events.get(listener.event) ?? [];
            collection.push(listener);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            client.events.set(listener.event, collection);
          }
        }
      } catch (error) {
        this.moduleLogger.error(error instanceof Error ? error.stack : error);
      }
    }

    if (this.moduleConfiguration.enableEventListeners) {
      this.moduleLogger.debug("Registering event.");

      for (const [event, listeners] of client.events) {
        client.on(event, (...args) => this.runEvent(listeners, client, ...args));
      }
    }

    if (this.moduleConfiguration.enableTimers) {
      this.moduleLogger.debug("Timers were enabled.");
      for (const timer of modules.map(module => module.timers).flat()) {
        this.runTimer(timer, client);
      }
    }

    if (this.moduleConfiguration.enableInteractions) {
      this.moduleLogger.debug("Interactions were enabled.");
      client.on("interactionCreate", this.interactionEvent.bind(this));
    }

    this.moduleLogger.info("Done.");
  }

  /**
   * Cleanup function.
   */
  public cleanup() {
    this.moduleLogger.info(`Cleaning up module configurations.`);
    for (const id of this.intervalIds) {
      clearInterval(id);
    }
  }

  public static registerCommand(command: SlashCommand, type: string) {
    if (!(type in ModuleService.commands)) {
      ModuleService.commands[type] = [];
    }

    ModuleService.commands[type].push(command);
  }

  // region Static Method

  /**
   * Todo: Setup modal responding.
   * Todo: Setup buttons/select menu
   * Todo: Context Menu.
   * The main interaction event callback function that is called when a Discord interaction event is called.
   * @param interaction The interaction data object.
   * @private
   */
  private async interactionEvent(interaction: Interaction): Promise<void> {
    this.interactionLogger.debug("Interaction event invoked.");

    try {
      if (interaction.isCommand()) {
        this.interactionLogger.debug("Interaction is a command.");

        if (interaction.isContextMenuCommand()) {
          this.interactionLogger.debug(
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
          this.moduleLogger.debug("Interaction is a chat input command. (Slash command.)");

          // Edge case if somehow a command can be invoked inside a DM.
          if (!interaction.guildId) {
            this.moduleLogger.debug("Warning! Command invoked outside of a guild. Exiting");
            return;
          }

          const command: SlashCommand | undefined = this.filteredModules
            .find(module => module.hasCommand(interaction.commandName))
            ?.getCommand(interaction.commandName);
          if (!command) {
            this.interactionLogger.error(`No command found with name: ${interaction.commandName}. Exiting`);
            return;
          }

          await command.callback(interaction);
        }
      } else {
        this.interactionLogger.debug("Interaction is not a command.");

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
      this.interactionLogger.error(error instanceof Error ? error.stack : error);

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

  // endregion
}
