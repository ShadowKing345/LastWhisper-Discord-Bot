import { ButtonInteraction, CommandInteraction, Interaction, ComponentType } from "discord.js";
import { clearInterval } from "timers";
import { singleton, injectAll } from "tsyringe";

import { Logger } from "../utils/logger.js";
import { Bot } from "../utils/objects/bot.js";
import { Module, ProjectConfiguration } from "../utils/objects/index.js";
import { Timer } from "../utils/objects/timer.js";
import { ModuleConfiguration } from "../utils/objects/moduleConfiguration.js";
import { CommandResolverError } from "../utils/errors/index.js";
import { Command } from "../utils/objects/command.js";
import { EventListeners } from "../utils/objects/eventListener.js";

/**
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
@singleton()
export class ModuleService {
  private readonly moduleConfiguration: ModuleConfiguration;
  private readonly intervalIds: number[] = [];

  private readonly _modules: Module[];

  private readonly moduleLogger: Logger = new Logger("ModuleConfiguration");
  private readonly interactionLogger: Logger = new Logger("InteractionExecution");
  private readonly eventLogger: Logger = new Logger("EventExecution");
  private readonly taskLogger: Logger = new Logger("TimerExecution");

  constructor(config: ProjectConfiguration, @injectAll(Module.name) modules: Module[]) {
    this.moduleConfiguration = config.moduleConfiguration;

    this._modules =
      this.moduleConfiguration.modules?.length !== 0
        ? modules.filter(module => {
          const inList = this.moduleConfiguration.modules?.includes(module.moduleName);
          const blacklist = this.moduleConfiguration.blacklist;
          return (!blacklist && inList) || (blacklist && !inList);
        })
        : modules;

    this.moduleLogger.debug(`Loaded modules: ${JSON.stringify(this._modules.map(module => module.moduleName))}.`);

    if (this.moduleConfiguration.enableCommands) {
      this.moduleLogger.debug("Commands enabled.");
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

          const command: Command | undefined = this.modules
            .find(module => module.hasCommand(interaction.commandName))
            ?.getCommand(interaction.commandName);
          if (!command) {
            this.interactionLogger.error(`No command found with name: ${interaction.commandName}. Exiting`);
            return;
          }

          await command.execute(interaction);
        }
      } else {
        this.interactionLogger.debug("Interaction is not a command.");

        if (interaction.isModalSubmit()) {
          await interaction.reply({ content: "Responded", ephemeral: true });
        }

        if (interaction.isMessageComponent()) {
          switch (interaction.componentType) {
            case ComponentType.Button:
              // const f = client.buttons.get((interaction as ButtonInteraction).customId);
              // if (!f) {
              //     await interaction.reply({
              //         content: "Cannot find action for this button.",
              //         ephemeral: true,
              //     });
              //     return;
              // }
              // await f(interaction as unknown as ChatInputCommandInteraction);
              break;
            case ComponentType.SelectMenu:
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
    for (const module of this.modules) {
      this.moduleLogger.info(module.moduleName);

      try {
        if (this.moduleConfiguration.enableEventListeners) {
          this.moduleLogger.debug("Setting up event module events.");

          for (const listener of module.eventListeners) {
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

      for (const [ event, listeners ] of client.events) {
        client.on(event, (...args) => this.runEvent(listeners, client, ...args));
      }
    }

    if (this.moduleConfiguration.enableTimers) {
      this.moduleLogger.debug("Timers were enabled.");
      for (const timer of this.modules.map(module => module.timers).flat()) {
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

  /**
   * List of all modules registered.
   */
  public get modules(): Module[] {
    return this._modules;
  }
}
