import { ButtonInteraction, CommandInteraction, ComponentType } from "discord.js";
import { clearInterval } from "timers";
import { container } from "tsyringe";
import { Module } from "../modules/module.js";
import { CommandResolverError } from "../utils/errors/index.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { ModuleConfiguration } from "./entities/index.js";
import { Logger } from "./logger.js";
export class ModuleService {
    moduleConfiguration;
    static commands = {};
    intervalIds = [];
    moduleLogger = new Logger("ModuleConfiguration");
    interactionLogger = new Logger("InteractionExecution");
    eventLogger = new Logger("EventExecution");
    taskLogger = new Logger("TimerExecution");
    constructor(moduleConfiguration = ConfigurationService.getConfiguration(CommonConfigurationKeys.MODULE, ModuleConfiguration)) {
        this.moduleConfiguration = moduleConfiguration;
    }
    get filteredModules() {
        console.log(ModuleService.commands);
        const modules = container.resolveAll(Module.name);
        if (this.moduleConfiguration.modules?.length !== 0) {
            return modules.filter(module => {
                const inList = this.moduleConfiguration.modules?.includes(module.moduleName);
                const blacklist = this.moduleConfiguration.blacklist;
                return (!blacklist && inList) || (blacklist && !inList);
            });
        }
        return modules;
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
                    const command = this.filteredModules
                        .find(module => module.hasCommand(interaction.commandName))
                        ?.getCommand(interaction.commandName);
                    if (!command) {
                        this.interactionLogger.error(`No command found with name: ${interaction.commandName}. Exiting`);
                        return;
                    }
                    await command.callback(interaction);
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
                        case ComponentType.StringSelect:
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
    cleanup() {
        this.moduleLogger.info(`Cleaning up module configurations.`);
        for (const id of this.intervalIds) {
            clearInterval(id);
        }
    }
    static registerCommand(command, type) {
        if (!(type in ModuleService.commands)) {
            ModuleService.commands[type] = [];
        }
        ModuleService.commands[type].push(command);
    }
}
//# sourceMappingURL=moduleService.js.map