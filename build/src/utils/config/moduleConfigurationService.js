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
import { ButtonInteraction, CommandInteraction, ComponentType } from "discord.js";
import { clearInterval } from "timers";
import { singleton, injectAll } from "tsyringe";
import { ConfigurationClass } from "../configurationClass.js";
import { LoggerService } from "../loggerService.js";
import { ModuleBase, ProjectConfiguration } from "../models/index.js";
import { CommandResolverError } from "../errors/commandResolverError.js";
/**
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
let ModuleConfigurationService = class ModuleConfigurationService extends ConfigurationClass {
    moduleConfiguration;
    intervalIds = [];
    _modules;
    moduleLogger;
    interactionLogger;
    eventLogger;
    taskLogger;
    constructor(config, modules, loggerFactory) {
        super();
        this.moduleConfiguration = config.moduleConfiguration;
        this.moduleLogger = loggerFactory.buildLogger("ModuleConfiguration");
        this.interactionLogger = loggerFactory.buildLogger("InteractionExecution");
        this.eventLogger = loggerFactory.buildLogger("EventExecution");
        this.taskLogger = loggerFactory.buildLogger("TimerExecution");
        this._modules = this.moduleConfiguration.modules?.length !== 0 ?
            modules.filter(module => {
                const inList = this.moduleConfiguration.modules.includes(module.moduleName);
                const blacklist = this.moduleConfiguration.blacklist;
                return (!blacklist && inList) || (blacklist && !inList);
            }) : modules;
        this.moduleLogger.debug(`Modules list. [${this._modules.map(module => module.moduleName)}]`);
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
    async interactionEvent(interaction) {
        this.interactionLogger.debug("Interaction event invoked.");
        try {
            if (interaction.isCommand()) {
                this.interactionLogger.debug("Interaction is a command.");
                if (interaction.isContextMenuCommand()) {
                    this.interactionLogger.debug(`Interaction is a ${interaction.isUserContextMenuCommand() ? "user" : "message"} context menu.`);
                    if (interaction.isUserContextMenuCommand()) {
                        await interaction.reply({ content: "Responded with a user", ephemeral: true });
                    }
                    else {
                        await interaction.reply({ content: "Responded with a message", ephemeral: true });
                    }
                }
                if (interaction.isChatInputCommand() && this.moduleConfiguration.enableCommands) {
                    this.moduleLogger.debug("Interaction is a chat input command. (Slash command.)");
                    // Edge case if somehow a command can be invoked inside a DM.
                    if (!interaction.guildId) {
                        this.moduleLogger.debug("Warning! Command invoked outside of a guild. Exiting");
                        await interaction.user.send("Sorry you cannot use this command outside of a server.");
                        return;
                    }
                    const command = this.modules.find(module => module.hasCommand(interaction.commandName))?.getCommand(interaction.commandName);
                    if (!command) {
                        this.interactionLogger.error(`No command found with name: ${interaction.commandName}. Exiting`);
                        return;
                    }
                    await command.execute(interaction);
                }
            }
            else {
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
        }
        catch (error) {
            this.interactionLogger.error(error instanceof Error ? error.stack : error);
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
        const results = await Promise.allSettled(listeners.map(listener => new Promise((resolve, reject) => {
            try {
                resolve(listener.execute(client, args));
            }
            catch (error) {
                reject(error);
            }
        })));
        for (const result of results.filter(result => result.status === "rejected")) {
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
    runTimer(timer, client) {
        try {
            this.intervalIds.push(setInterval(async () => {
                try {
                    await timer.execute(client);
                }
                catch (error) {
                    this.taskLogger.error(error instanceof Error ? error.stack : error);
                }
            }, timer.timeout, client));
            timer.execute(client).catch(error => this.taskLogger.error(error instanceof Error ? error.stack : error));
        }
        catch (error) {
            this.taskLogger.error(error instanceof Error ? error.stack : error);
        }
    }
    /**
     * Configures a client with all the necessary module and callback information.
     * Registers events, timers, commands, etc...
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     */
    configureModules(client) {
        this.moduleLogger.info("Loading modules.");
        for (const module of this.modules) {
            this.moduleLogger.info(module.moduleName);
            try {
                if (this.moduleConfiguration.enableEventListeners) {
                    this.moduleLogger.debug("Setting up event module events.");
                    for (const listener of module.eventListeners) {
                        const collection = client.events.get(listener.event) ?? [];
                        collection.push(listener);
                        client.events.set(listener.event, collection);
                    }
                }
            }
            catch (error) {
                this.moduleLogger.error(error instanceof Error ? error.stack : error);
            }
        }
        if (this.moduleConfiguration.enableEventListeners) {
            this.moduleLogger.debug("Registering event.");
            for (const [event, listeners] of client.events) {
                client.on(event, (...args) => this.runEvent(listeners, client, args));
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
    cleanup() {
        this.moduleLogger.info(`Cleaning up module configurations.`);
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