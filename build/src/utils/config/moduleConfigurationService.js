var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ButtonInteraction, CommandInteraction } from "discord.js";
import { clearInterval } from "timers";
import { singleton, injectAll } from "tsyringe";
import { ConfigurationClass } from "../configurationClass.js";
import { LoggerService } from "../loggerService.js";
import { ModuleBase, ProjectConfiguration } from "../models/index.js";
/**
 * Todo: Allow for the user to disable the individual components.
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
let ModuleConfigurationService = class ModuleConfigurationService extends ConfigurationClass {
    moduleConfiguration;
    intervalIds = [];
    _modules;
    loggers;
    constructor(config, modules, loggerFactory) {
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
        console.log(this._modules);
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
    async interactionEvent(interaction) {
        this.loggers.module.debug("Interaction Innovated");
        try {
            if (interaction.isContextMenuCommand()) {
                if (interaction.isUserContextMenuCommand()) {
                    await interaction.reply({ content: "Responded with a user", ephemeral: true });
                }
                else {
                    await interaction.reply({ content: "Responded with a message", ephemeral: true });
                }
            }
            if (interaction.isModalSubmit()) {
                await interaction.reply({ content: "Responded", ephemeral: true });
            }
            if (interaction.isMessageComponent()) {
                console.log(interaction.componentType);
                switch (interaction.componentType) {
                    default:
                        break;
                }
                await interaction.reply({ content: "Responded", ephemeral: true });
            }
            if (interaction.isChatInputCommand()) {
                this.loggers.module.debug("Confirmed Command Interaction.");
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) {
                    this.loggers.module.debug(`No command found with name: ${interaction.commandName}.`);
                    return;
                }
                await command.execute(interaction);
            }
        }
        catch (error) {
            this.loggers.interaction.error(error instanceof Error ? error.stack : error);
            if (interaction && (interaction instanceof ButtonInteraction || interaction instanceof CommandInteraction) && !interaction.replied) {
                if (interaction.deferred) {
                    await interaction.editReply({ content: "There was an internal error that occurred when using this interaction." });
                }
                else {
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
    async runEvent(listeners, client, ...args) {
        const results = await Promise.allSettled(listeners.map(l => new Promise(async (resolve, reject) => {
            try {
                resolve(l.run(client, args));
            }
            catch (error) {
                reject(error);
            }
        })));
        for (const result of results.filter(result => result.status === "rejected")) {
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
    async runTimer(task, client) {
        try {
            client.tasks.set(task.name, task);
            this.intervalIds.push(setInterval(async () => {
                try {
                    await task.run(client);
                }
                catch (error) {
                    this.loggers.task.error(error instanceof Error ? error.stack : error);
                }
            }, task.timeout, client));
            await task.run(client);
        }
        catch (error) {
            this.loggers.task.error(error instanceof Error ? error.stack : error);
        }
    }
    /**
     * Todo: Cleanup.
     * Configures a client with all the necessary module and callback information.
     * Registers events, timers, commands, etc...
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     */
    configureModules(client) {
        this.loggers.module.info("Loading modules.");
        for (const module of this.modules) {
            try {
                this.loggers.module.info(`Setting Up module ${module.moduleName}`);
                client.modules.set(module.moduleName, module);
                if (!this.moduleConfiguration.disableCommands) {
                    this.loggers.module.debug(`Setting Up commands...`);
                    // module.commands.forEach(command => client.commands.set(BuildCommand(command).name, command as ChatInputCommand));
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
            }
            catch (error) {
                this.loggers.module.error(error instanceof Error ? error.stack : error);
            }
        }
        if (!this.moduleConfiguration.disableEventListeners) {
            this.loggers.module.debug(`Setting Up events...`);
            for (const [event, listeners] of client.moduleListeners) {
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
    cleanup() {
        this.loggers.module.info(`Cleaning up module configurations.`);
        for (const id of this.intervalIds) {
            clearInterval(id);
        }
    }
    /**
     * List of all modules registered.
     */
    get modules() {
        return this._modules;
    }
};
ModuleConfigurationService = __decorate([
    singleton(),
    __param(1, injectAll(ModuleBase.name)),
    __metadata("design:paramtypes", [ProjectConfiguration, Array, LoggerService])
], ModuleConfigurationService);
export { ModuleConfigurationService };
//# sourceMappingURL=moduleConfigurationService.js.map