import { CommandResolverError } from "../utils/errors/index.js";
import { Logger } from "../config/logger.js";
export class Module {
    permissionManagerService;
    logger = new Logger(Module);
    static moduleName = "";
    commands = [];
    eventListeners = [];
    timers = [];
    buttons = null;
    selectMenus = null;
    modalSubmits = null;
    commandResolverKeys = {};
    constructor(permissionManagerService) {
        this.permissionManagerService = permissionManagerService;
    }
    commandResolver(interaction, call = true) {
        this.logger.debug(`Command invoked, dealing with subcommand options.`);
        const command = [
            interaction.commandName,
            interaction.options.getSubcommandGroup(),
            interaction.options.getSubcommand(),
        ]
            .filter(item => item)
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
        return this.commands.find(c => c.name === command) != null;
    }
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
//# sourceMappingURL=module.js.map