import { CommandResolverError } from "../errors/commandResolverError.js";
/**
 * Base class for a module.
 */
export class ModuleBase {
    permissionManagerService;
    logger;
    moduleName = "";
    commands = [];
    eventListeners = [];
    timers = [];
    buttons;
    selectMenus;
    modalSubmits;
    commandResolverKeys = {};
    constructor(permissionManagerService, logger) {
        this.permissionManagerService = permissionManagerService;
        this.logger = logger;
    }
    /**
     * Method to resolve a slash command call from the discord client.
     * Will throw an error if the function was not found.
     * @param interaction Interaction object.
     * @param call Flag to set if the object should be called or just returned.
     * @throws Error
     * @protected
     */
    async commandResolver(interaction, call = true) {
        this.logger.debug(`Command invoked, dealing with subcommand options.`);
        const command = [interaction.commandName, interaction.options.getSubcommandGroup(), interaction.options.getSubcommand()].filter(item => item).join(".");
        let f = this.commandResolverKeys[command];
        if (!f) {
            const error = new CommandResolverError("No command found with this name.");
            this.logger.error(error.stack);
            throw error;
        }
        f = f.bind(this);
        return call ? f(interaction) : f;
    }
    /**
     * Checks if the command with a given name is contained inside this object.
     * @param command The name of the command.
     */
    hasCommand(command) {
        if (!this.handlesCommands) {
            return false;
        }
        return this.commands.find(c => c.name === command) != null;
    }
    /**
     * Returns the first instance of a command with the given name.
     * @param command The name of the command.
     */
    getCommand(command) {
        if (!this.handlesCommands) {
            return undefined;
        }
        return this.commands.find(c => c.name === command);
    }
    get handlesCommands() {
        return this.commands?.length > 0;
    }
    get handlesButtons() {
        return Object.values(this.buttons).length > 0;
    }
    get handlesSelectMenu() {
        return Object.values(this.selectMenus).length > 0;
    }
}
//# sourceMappingURL=moduleBase.js.map