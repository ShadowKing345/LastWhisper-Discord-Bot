import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.js";
import { DatabaseConfiguration } from "./databaseConfiguration.js";
import { ToJsonBase } from "../objects/toJsonBase.js";
import { deepMerge } from "../index.js";
import { LoggerConfigs } from "./loggerConfigs.js";
/**
 * Default configuration object for the application.
 */
export class ProjectConfiguration extends ToJsonBase {
    // Discord application token.
    token = null;
    // Database settings.
    database = new DatabaseConfiguration();
    // Configuration for command registration.
    commandRegistration = new CommandRegistrationConfiguration();
    // Configuration for logger.
    logger = new LoggerConfigs();
    merge(obj) {
        if (obj.token) {
            this.token = obj.token;
        }
        if (obj.database) {
            this.database = deepMerge(this.database ?? new DatabaseConfiguration, obj.database);
        }
        if (obj.commandRegistration) {
            this.commandRegistration = deepMerge(this.commandRegistration ?? new CommandRegistrationConfiguration, obj.commandRegistration);
        }
        if (obj.logger) {
            this.logger = deepMerge(this.logger ?? new LoggerConfigs(), obj.logger);
        }
        return this;
    }
}
//# sourceMappingURL=projectConfiguration.js.map