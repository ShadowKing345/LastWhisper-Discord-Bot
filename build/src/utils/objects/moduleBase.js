import { CommandResolverError } from "../errors/commandResolverError.js";
/**
 * Base class for a module.
 */
export class ModuleBase {
    permissionManagerService;
    logger;
    moduleName = "";
    commands = [];
    listeners = [];
    tasks = [];
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
}
//# sourceMappingURL=moduleBase.js.map