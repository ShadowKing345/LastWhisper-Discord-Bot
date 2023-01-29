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
    static slashCommands = {};
    static eventListeners = {};
    static timers = [];
    intervalIds = [];
    moduleLogger = new Logger("ModuleConfiguration");
    interactionLogger = new Logger("InteractionExecution");
    eventLogger = new Logger("EventExecution");
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
                this.eventLogger.error(result.reason);
            }
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
                    const commandStruct = ModuleService.slashCommands[interaction.commandName];
                    if (!commandStruct) {
                        this.interactionLogger.error(`No command found with name: ${interaction.commandName}. Exiting`);
                        return;
                    }
                    await this.callCallback(commandStruct.type, commandStruct.value.callback, [interaction]);
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
    configureModules(client) {
        this.moduleLogger.info("Loading modules.");
        if (this.moduleConfiguration.enableEventListeners) {
            this.moduleLogger.debug("Registering event.");
            for (const eventName in ModuleService.eventListeners) {
                client.on(eventName, (...args) => this.runEvent(ModuleService.eventListeners[eventName], client, args));
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