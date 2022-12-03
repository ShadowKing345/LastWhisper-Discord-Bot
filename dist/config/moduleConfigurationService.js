import { __decorate, __metadata, __param } from "tslib";
import { ButtonInteraction, CommandInteraction, ComponentType } from "discord.js";
import { clearInterval } from "timers";
import { singleton, injectAll } from "tsyringe";
import { ConfigurationClass } from "./configurationClass.js";
import { LoggerService } from "../services/loggerService.js";
import { Module, ProjectConfiguration } from "../utils/objects/index.js";
import { CommandResolverError } from "../utils/errors/index.js";
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
        this._modules =
            this.moduleConfiguration.modules?.length !== 0
                ? modules.filter(module => {
                    const inList = this.moduleConfiguration.modules?.includes(module.moduleName);
                    const blacklist = this.moduleConfiguration.blacklist;
                    return (!blacklist && inList) || (blacklist && !inList);
                })
                : modules;
        this.moduleLogger.debug(`Modules list. [${this._modules.map(module => module.moduleName).join(",")}]`);
        if (this.moduleConfiguration.enableCommands) {
            this.moduleLogger.debug("Commands enabled.");
        }
    }
    async interactionEvent(interaction) {
        this.interactionLogger.debug("Interaction event invoked.");
        try {
            if (interaction.isCommand()) {
                this.interactionLogger.debug("Interaction is a command.");
                if (interaction.isContextMenuCommand()) {
                    this.interactionLogger.debug(`Interaction is a ${interaction.isUserContextMenuCommand() ? "user" : "message"} context menu.`);
                    if (interaction.isUserContextMenuCommand()) {
                        await interaction.reply({
                            content: "Responded with a user",
                            ephemeral: true,
                        });
                    }
                    else {
                        await interaction.reply({
                            content: "Responded with a message",
                            ephemeral: true,
                        });
                    }
                }
                if (interaction.isChatInputCommand() && this.moduleConfiguration.enableCommands) {
                    this.moduleLogger.debug("Interaction is a chat input command. (Slash command.)");
                    if (!interaction.guildId) {
                        this.moduleLogger.debug("Warning! Command invoked outside of a guild. Exiting");
                        return;
                    }
                    const command = this.modules
                        .find(module => module.hasCommand(interaction.commandName))
                        ?.getCommand(interaction.commandName);
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
            if (interaction &&
                (interaction instanceof ButtonInteraction || interaction instanceof CommandInteraction) &&
                !interaction.replied) {
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
    runTimer(timer, client) {
        try {
            this.intervalIds.push(setInterval(() => {
                timer.execute(client).catch(error => this.taskLogger.error(error instanceof Error ? error.stack : error));
            }, timer.timeout, client));
            timer.execute(client).catch(error => this.taskLogger.error(error instanceof Error ? error.stack : error));
        }
        catch (error) {
            this.taskLogger.error(error instanceof Error ? error.stack : error);
        }
    }
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
    cleanup() {
        this.moduleLogger.info(`Cleaning up module configurations.`);
        for (const id of this.intervalIds) {
            clearInterval(id);
        }
    }
    get modules() {
        return this._modules;
    }
};
ModuleConfigurationService = __decorate([
    singleton(),
    __param(1, injectAll(Module.name)),
    __metadata("design:paramtypes", [ProjectConfiguration, Array, LoggerService])
], ModuleConfigurationService);
export { ModuleConfigurationService };
//# sourceMappingURL=moduleConfigurationService.js.map