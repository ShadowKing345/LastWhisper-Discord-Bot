import { ButtonInteraction, CommandInteraction, ComponentType } from "discord.js";
import { clearInterval } from "timers";
import { container } from "tsyringe";
import { CommandResolverError } from "../utils/errors/index.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { ModuleConfiguration } from "./entities/index.js";
import { Logger } from "./logger.js";
import { DatabaseService } from "./databaseService.js";
import { isRejectedPromise } from "../utils/index.js";
export class ModuleService {
    moduleConfiguration;
    static moduleServiceLogger = new Logger(ModuleService.name);
    static slashCommands = {};
    static eventListeners = {};
    static timers = [];
    static timerChildInstance = container.createChildContainer();
    intervalIds = [];
    constructor(moduleConfiguration = ConfigurationService.getConfiguration(CommonConfigurationKeys.MODULE, ModuleConfiguration)) {
        this.moduleConfiguration = moduleConfiguration;
    }
    async runEvent(listeners, client, args) {
        const childContainer = container.createChildContainer();
        const dbService = childContainer.resolve(DatabaseService);
        await dbService.connect();
        const results = await Promise.allSettled(listeners.map(struct => {
            const obj = childContainer.resolve(struct.type);
            return struct.value.execute.apply(obj, [client, args]);
        }));
        await dbService.disconnect();
        for (const result of results) {
            if (isRejectedPromise(result)) {
                ModuleService.moduleServiceLogger.error(result.reason);
            }
        }
    }
    async interactionEvent(interaction) {
        ModuleService.moduleServiceLogger.debug("Interaction event invoked.");
        try {
            if (interaction.isCommand()) {
                ModuleService.moduleServiceLogger.debug("Interaction is a command.");
                if (interaction.isContextMenuCommand()) {
                    ModuleService.moduleServiceLogger.debug(`Interaction is a ${interaction.isUserContextMenuCommand() ? "user" : "message"} context menu.`);
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
                    ModuleService.moduleServiceLogger.debug("Interaction is a chat input command. (Slash command.)");
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
            }
            else {
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
        }
        catch (error) {
            ModuleService.moduleServiceLogger.error(error);
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
    async runTimers(timerStructs, client) {
        const dbService = ModuleService.timerChildInstance.resolve(DatabaseService);
        for (const struct of timerStructs) {
            try {
                const callback = struct.value.execute;
                const thisObj = ModuleService.timerChildInstance.resolve(struct.type);
                if (struct.value.timeout < 5000) {
                    if (!dbService.isConnected) {
                        await dbService.connect();
                    }
                    this.intervalIds.push(setInterval((callback, thisObj, client) => {
                        callback.apply(thisObj, [client]).then(null, error => ModuleService.moduleServiceLogger.error(error));
                    }, struct.value.timeout, callback, thisObj, client));
                }
                else {
                    this.intervalIds.push(setInterval((callback, client) => {
                        this.callCallback(struct.type, callback, [client])
                            .then(null, error => ModuleService.moduleServiceLogger.error(error));
                    }, struct.value.timeout, callback, client));
                }
                await this.callCallback(struct.type, callback, [client]);
            }
            catch (error) {
                ModuleService.moduleServiceLogger.error(error);
            }
        }
    }
    async configureModules(client) {
        ModuleService.moduleServiceLogger.info("Loading modules.");
        if (this.moduleConfiguration.enableInteractions) {
            ModuleService.moduleServiceLogger.debug("Interactions were enabled.");
            client.on("interactionCreate", this.interactionEvent.bind(this));
        }
        if (this.moduleConfiguration.enableTimers) {
            ModuleService.moduleServiceLogger.debug("Timers were enabled.");
            await this.runTimers(ModuleService.timers, client);
        }
        if (this.moduleConfiguration.enableEventListeners) {
            ModuleService.moduleServiceLogger.debug("Registering event.");
            for (const eventName in ModuleService.eventListeners) {
                client.on(eventName, (...args) => this.runEvent(ModuleService.eventListeners[eventName], client, args));
            }
        }
        ModuleService.moduleServiceLogger.info("Done.");
    }
    async cleanup() {
        ModuleService.moduleServiceLogger.info(`Cleaning up module configurations.`);
        for (const id of this.intervalIds) {
            clearInterval(id);
        }
        const dbService = ModuleService.timerChildInstance.resolve(DatabaseService);
        if (dbService.isConnected) {
            await dbService.disconnect();
        }
    }
    async callCallback(type, callback, args) {
        const childContainer = container.createChildContainer();
        const dbService = childContainer.resolve(DatabaseService);
        await dbService.connect();
        const obj = childContainer.resolve(type);
        const result = await callback.apply(obj, args);
        await dbService.disconnect();
        return result;
    }
    static registerSlashCommand(command, type) {
        ModuleService.slashCommands[command.name] = { value: command, type };
    }
    static getSlashCommands() {
        return Object.values(ModuleService.slashCommands);
    }
    static registerEventListener(listener, type) {
        const eventName = listener.event;
        if (!(eventName in ModuleService.eventListeners)) {
            ModuleService.eventListeners[eventName] = [];
        }
        ModuleService.eventListeners[eventName].push({ value: listener, type });
    }
    static getEventListeners() {
        return Object.values(ModuleService.eventListeners).reduce((prev, current) => {
            prev.push(...current);
            return prev;
        }, []);
    }
    static registerTimer(timer, type) {
        ModuleService.timers.push({ value: timer, type });
    }
    static getTimers() {
        return ModuleService.timers;
    }
}
//# sourceMappingURL=moduleService.js.map