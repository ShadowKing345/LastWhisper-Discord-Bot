import { CommandResolverError } from "../errors/commandResolverError.js";
export class ModuleBase {
    permissionManagerService;
    logger;
    moduleName = "";
    commands = [];
    eventListeners = [];
    timers = [];
    buttons = null;
    selectMenus = null;
    modalSubmits = null;
    commandResolverKeys = {};
    constructor(permissionManagerService, logger) {
        this.permissionManagerService = permissionManagerService;
        this.logger = logger;
    }
    commandResolver(interaction, call = true) {
        this.logger.debug(`Command invoked, dealing with subcommand options.`);
        const command = [
            interaction.commandName,
            interaction.options.getSubcommandGroup(),
            interaction.options.getSubcommand(),
        ]
            .filter((item) => item)
            .join(".");
        const f = this.commandResolverKeys[command];
        if (!f) {
            const error = new CommandResolverError("No command found with this name.");
            this.logger.error(error.stack);
            throw error;
        }
        return call ? f(interaction) : f;
    }
    hasCommand(command) {
        if (!this.handlesCommands) {
            return false;
        }
        return this.commands.find((c) => c.name === command) != null;
    }
    getCommand(command) {
        if (!this.handlesCommands) {
            return undefined;
        }
        return this.commands.find((c) => c.name === command);
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