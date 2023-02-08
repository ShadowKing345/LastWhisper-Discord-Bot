import { CommandResolverError } from "../utils/errors/index.js";
export class Module {
    logger;
    permissionManagerService;
    moduleName = "Module";
    commandResolverKeys = {};
    constructor(logger, permissionManagerService) {
        this.logger = logger;
        this.permissionManagerService = permissionManagerService;
    }
    async commandResolver(interaction, call = true) {
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
            this.logger.error(error);
            throw error;
        }
        return call ? f(interaction) : f;
    }
}
//# sourceMappingURL=module.js.map