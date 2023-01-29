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
    constructor(moduleConfiguration = ConfigurationService.getConfiguration(CommonConfigurationKeys.MODULE, ModuleConfiguration)) {
        this.moduleConfiguration = moduleConfiguration;
    }
    get filteredModules() {
        console.log(ModuleService.commands);
        const modules = container.resolveAll(Module.name);
        return modules;
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
                    const commandStruct = ModuleService.commands[interaction.commandName];
                    if (!commandStruct) {
                        this.interactionLogger.error(`No command found with name: ${interaction.commandName}. Exiting`);
                        return;
                    }
                    await this.callCallback(commandStruct.type, commandStruct.command.callback, [interaction]);
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
    callCallback(type, callback, args) {
        const thisArg = container.resolve(type);
        return callback.apply(thisArg, args);
    }
    static registerCommand(command, type) {
        ModuleService.commands[command.name] = { command, type };
    }
}
//# sourceMappingURL=moduleService.js.map