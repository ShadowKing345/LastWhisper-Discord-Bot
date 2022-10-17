import { ButtonInteraction, CommandInteraction, Interaction, ComponentType, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { clearInterval } from "timers";
import { singleton, injectAll } from "tsyringe";

import { ConfigurationClass } from "../configurationClass.js";
import { LoggerService } from "../loggerService.js";
import { Client } from "../models/client.js";
import { ModuleBase, ProjectConfiguration, EventListener } from "../models/index.js";
import { Task } from "../models/task.js";
import { ModuleConfiguration } from "../models/moduleConfiguration.js";
import { CommandBuilder } from "../objects/commandBuilder.js";
import { CommandResolverError } from "../errors/commandResolverError.js";

/**
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
@singleton()
export class ModuleConfigurationService extends ConfigurationClass {
    private readonly moduleConfiguration: ModuleConfiguration;
    private readonly intervalIds: number[] = [];
    private readonly _modules: ModuleBase[];
    private readonly loggers: { module: pino.Logger, interaction: pino.Logger, event: pino.Logger, task: pino.Logger };

    constructor(
        config: ProjectConfiguration,
        @injectAll(ModuleBase.name) modules: ModuleBase[],
        loggerFactory: LoggerService,
    ) {
        super();

        this.moduleConfiguration = config.moduleConfiguration;

        this.loggers = {
            module: loggerFactory.buildLogger("ModuleConfiguration"),
            interaction: loggerFactory.buildLogger("InteractionExecution"),
            event: loggerFactory.buildLogger("EventExecution"),
            task: loggerFactory.buildLogger("TimerExecution"),
        };
        this._modules = this.moduleConfiguration.modules?.length !== 0 ?
            modules.filter(module => {
                const inList = this.moduleConfiguration.modules.includes(module.moduleName);
                const blacklist = this.moduleConfiguration.blacklist;
                return (!blacklist && inList) || (blacklist && !inList);
            }) : modules;
    }

    /**
     * Todo: Cleanup.
     * Todo: Setup modal responding.
     * Todo: Setup buttons/select menu
     * Todo: Context Menu.
     * The main interaction event callback function that is called when a Discord interaction event is called.
     * @param interaction The interaction data object.
     * @private
     */
    private async interactionEvent(interaction: Interaction): Promise<void> {
        this.loggers.module.debug("Interaction Innovated");

        try {
            const client = interaction.client as Client;

            if (interaction.isContextMenuCommand()) {
                if (interaction.isUserContextMenuCommand()) {
                    await interaction.reply({ content: "Responded with a user", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Responded with a message", ephemeral: true });
                }
            }

            if (interaction.isModalSubmit()) {
                await interaction.reply({ content: "Responded", ephemeral: true });
            }

            if (interaction.isMessageComponent()) {
                switch (interaction.componentType) {
                    case ComponentType.Button:
                        const f = client.buttons.get((interaction as ButtonInteraction).customId);
                        if (!f) {
                            await interaction.reply({
                                content: "Cannot find action for this button.",
                                ephemeral: true,
                            });
                            return;
                        }
                        await f(interaction as unknown as ChatInputCommandInteraction);
                        break;
                    case ComponentType.SelectMenu:
                        break;
                    default:
                        break;
                }
            }

            if (interaction.isChatInputCommand()) {
                this.loggers.module.debug("Confirmed Command Interaction.");

                if (!interaction.inGuild()) {
                    this.loggers.module.debug("Warning! Command invoked outside of a guild.");
                    await (interaction as CommandInteraction).user.send("Sorry you cannot use this command outside of a server.");
                    return;
                }

                const command: CommandBuilder = (interaction.client as Client).commands.get(interaction.commandName);
                if (!command) {
                    this.loggers.module.debug(`No command found with name: ${interaction.commandName}.`);
                    return;
                }

                await command.execute(interaction);
            }
        } catch (error: Error | unknown) {
            this.loggers.interaction.error(error instanceof Error ? error.stack : error);

            if (interaction && (interaction instanceof ButtonInteraction || interaction instanceof CommandInteraction) && !interaction.replied) {
                if (error instanceof CommandResolverError) {
                    await interaction.reply({
                        content: "Sorry there was an issue resolving the command name.",
                        ephemeral: true,
                    });
                    return;
                }

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
     * Callback function when a general event other than the interaction event is called.
     * @param listeners A collection of all the listeners to this event.
     * @param client The main application client. Not to be confused with Discord.Js Client.
     * @param args Any additional arguments provided to the event.
     * @private
     */
    private async runEvent(listeners: EventListener[], client: Client, ...args: any[]): Promise<void> {
        const results = await Promise.allSettled(listeners.map(l => new Promise(async (resolve, reject) => {
            try {
                resolve(l.run(client, args));
            } catch (error: Error | unknown) {
                reject(error);
            }
        })));

        for (const result of results.filter(result => result.status === "rejected") as PromiseRejectedResult[]) {
            this.loggers.event.error(result.reason instanceof Error ? result.reason.stack : result.reason);
        }
    }

    /**
     * Todo: Cleanup.
     * Function that sets up a Javascript timer to go off.
     * Also fires the timer as well.
     * @param task The timer object data used to create a timer.
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     * @private
     */
    private async runTimer(task: Task, client: Client): Promise<void> {
        try {
            client.tasks.set(task.name, task);
            this.intervalIds.push(setInterval(async () => {
                try {
                    await task.run(client);
                } catch (error: Error | unknown) {
                    this.loggers.task.error(error instanceof Error ? error.stack : error);
                }
            }, task.timeout, client));
            await task.run(client);
        } catch (error: Error | unknown) {
            this.loggers.task.error(error instanceof Error ? error.stack : error);
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

                if (!this.moduleConfiguration.disableCommands) {
                    this.loggers.module.debug(`Setting Up commands...`);
                    module.commands.forEach(command => client.commands.set(command.name, command));
                }

                for (let buttonsKey in module.buttons) {
                    client.buttons.set(buttonsKey, module.buttons[buttonsKey]);
                }

                if (!this.moduleConfiguration.disableEventListeners) {
                    this.loggers.module.debug(`Setting Up listeners...`);
                    module.listeners.forEach(listener => {
                        const listeners = client.moduleListeners.get(listener.event) ?? [];
                        listeners.push(listener);
                        client.moduleListeners.set(listener.event, listeners);
                    });
                }

                if (!this.moduleConfiguration.disableTimers) {
                    this.loggers.module.debug(`Setting Up tasks...`);
                    module.tasks.forEach(task => this.runTimer(task, client));
                }
            } catch (error: Error | unknown) {
                this.loggers.module.error(error instanceof Error ? error.stack : error);
            }
        }

        if (!this.moduleConfiguration.disableEventListeners) {
            this.loggers.module.debug(`Setting Up events...`);
            for (const [ event, listeners ] of client.moduleListeners) {
                client.on(event, (...args) => this.runEvent(listeners, client, args));
            }
        }

        if (!this.moduleConfiguration.disableInteractions) {
            this.loggers.module.debug(`Setting Up interaction event...`);
            client.on("interactionCreate", interaction => this.interactionEvent(interaction));
        }
    }

    /**
     * Cleanup function.
     */
    public cleanup() {
        this.loggers.module.info(`Cleaning up module configurations.`);
        for (const id of this.intervalIds) {
            clearInterval(id);
        }
    }

    /**
     * List of all modules registered.
     */
    public get modules(): ModuleBase[] {
        return this._modules;
    }
}
