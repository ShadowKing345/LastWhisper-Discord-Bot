import chalk from "chalk";
import { ButtonInteraction, CommandInteraction, Interaction } from "discord.js";
import { pino } from "pino";
import { clearInterval } from "timers";
import { singleton } from "tsyringe";

import { ConfigurationClass } from "../configuration.class.js";
import { LoggerService } from "../loggerService.js";
import { Client } from "../models/client.js";
import { BuildCommand, Command } from "../models/command.js";
import { Listener } from "../models/listener.js";
import { ModuleBase } from "../models/index.js";
import { Task } from "../models/task.js";
import { BuffManagerModule } from "../../modules/buffManager.module.js";
import { EventManagerModule } from "../../modules/eventManager.module.js";
import { GardeningManagerModule } from "../../modules/gardeningManager.module.js";
import { ManagerUtilsModule } from "../../modules/managerUtils.module.js";
import { RoleManagerModule } from "../../modules/roleManager.module.js";
import { PermissionManagerModule } from "../../modules/permissionManager.module.js";

/**
 * Todo: Cleanup.
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
@singleton()
export class ModuleConfigurationService extends ConfigurationClass {
    private readonly intervalIds: number[] = [];
    private readonly _modules: ModuleBase[];
    private readonly loggers: { module: pino.Logger, interaction: pino.Logger, event: pino.Logger, task: pino.Logger };

    constructor(
        buffManagerModule: BuffManagerModule,
        eventManagerModule: EventManagerModule,
        gardeningManagerModule: GardeningManagerModule,
        managerUtilsModule: ManagerUtilsModule,
        roleManagerModule: RoleManagerModule,
        permissionManagerModule: PermissionManagerModule,
        loggerFactory: LoggerService,
    ) {
        super();
        this.loggers = {
            module: loggerFactory.buildLogger("ModuleConfiguration"),
            interaction: loggerFactory.buildLogger("InteractionExecution"),
            event: loggerFactory.buildLogger("EventExecution"),
            task: loggerFactory.buildLogger("TimerExecution"),
        };
        this._modules = [
            buffManagerModule,
            eventManagerModule,
            gardeningManagerModule,
            managerUtilsModule,
            roleManagerModule,
            permissionManagerModule,
        ];
    }

    /**
     * Todo: Cleanup.
     * The main interaction event callback function that is called when a Discord interaction event is called.
     * @param interaction The interaction data object.
     * @private
     */
    private async interactionEvent(interaction: Interaction): Promise<void> {
        this.loggers.module.debug(chalk.magentaBright("Interaction Innovated"));

        try {
            if (interaction.isMessageComponent()) {
                switch (interaction.componentType) {
                    case "BUTTON":
                        break;
                    case "SELECT_MENU":
                        break;
                    case "TEXT_INPUT":
                        break;
                    default:
                        break;
                }
            }

            if (interaction.isCommand()) {
                this.loggers.module.debug(chalk.magentaBright("Confirmed Command Interaction."));
                const command: Command = (interaction.client as Client).commands.get(interaction.commandName);
                if (!command) {
                    this.loggers.module.debug(`No command found with name: ${chalk.yellow(interaction.commandName)}.`);
                    return;
                }

                await command.run(interaction);
            }
        } catch (error: Error | unknown) {
            this.loggers.interaction.error(error instanceof Error ? error + error.stack : error);

            if (interaction && (interaction instanceof ButtonInteraction || interaction instanceof CommandInteraction) && !interaction.replied) {
                if (interaction.deferred) {
                    await interaction.editReply({ content: "There was an internal error that occurred when using this interaction." });
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
     * Todo: Cleanup.
     * Callback function when a general event other than the interaction event is called.
     * @param listeners A collection of all the listeners to this event.
     * @param client The main application client. Not to be confused with Discord.Js Client.
     * @param args Any additional arguments provided to the event.
     * @private
     */
    private async runEvent(listeners: Listener[], client: Client, ...args: any[]): Promise<void> {
        for (let i = 0; i < listeners.length; i++) {
            try {
                await listeners[i].run(client, ...args);
            } catch (error: Error | unknown) {
                this.loggers.event.error(error instanceof Error ? error + error.stack : error);
            }
        }
    }

    /**
     * Todo: Rename to timer.
     * Todo: Cleanup.
     * Function to setup a Javascript timer to go off.
     * Also fires the timer as well.
     * @param task The timer object data used to create a timer.
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     * @private
     */
    private async runTask(task: Task, client: Client): Promise<void> {
        try {
            client.tasks.set(task.name, task);
            this.intervalIds.push(setInterval(async () => {
                try {
                    await task.run(client);
                } catch (error: Error | unknown) {
                    this.loggers.task.error(error instanceof Error ? error + error.stack : error);
                }
            }, task.timeout, client));
            await task.run(client);
        } catch (error: Error | unknown) {
            this.loggers.task.error(error instanceof Error ? error + error.stack : error);
        }
    }

    /**
     * Todo: Cleanup.
     * Configures a client with all the necessary module and callback information.
     * Registers events, timers, commands, etc...
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     */
    public configureModules(client: Client): void {
        this.loggers.module.info("Loading modules.");
        for (const module of this.modules) {
            try {
                this.loggers.module.info(`Setting Up module ${module.moduleName}`);
                client.modules.set(module.moduleName, module);

                this.loggers.module.debug(`Setting Up commands...`);
                module.commands.forEach(command => client.commands.set(BuildCommand(command).name, command as Command));

                this.loggers.module.debug(`Setting Up listeners...`);
                module.listeners.forEach(listener => {
                    const listeners = client.moduleListeners.get(listener.event) ?? [];
                    listeners.push(listener);
                    client.moduleListeners.set(listener.event, listeners);
                });

                this.loggers.module.debug(`Setting Up tasks...`);
                module.tasks.forEach(task => this.runTask(task, client));
            } catch (error: Error | unknown) {
                this.loggers.module.error(error instanceof Error ? error + error.stack : error);
            }
        }

        this.loggers.module.debug(`Setting Up events...`);
        client.moduleListeners.forEach((listener, event) => client.on(event, async (...args) => this.runEvent(listener, client, ...args)));

        this.loggers.module.debug(`Setting Up interaction event...`);
        client.on("interactionCreate", interaction => this.interactionEvent(interaction));
    }

    /**
     * Todo: Cleanup.
     * Cleanup function.
     */
    public cleanup() {
        this.loggers.module.info(`Cleaning up module configurations.`);
        for (const id of this.intervalIds) {
            clearInterval(id);
        }
    }

    /**
     * Todo: Cleanup.
     * List of all modules registered.
     */
    public get modules(): ModuleBase[] {
        return this._modules;
    }
}
