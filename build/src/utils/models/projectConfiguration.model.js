import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.model.js";
import { DatabaseConfiguration } from "./databaseConfiguration.model.js";
import { ToJsonBase } from "../objects/toJsonBase.js";
import { deepMerge } from "../index.js";
import { LoggingConfigs } from "./loggingConfigs.js";
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
    logging = new LoggingConfigs();
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
        if (obj.logging) {
            this.logging = deepMerge(this.logging ?? new LoggingConfigs(), obj.logging);
        }
        return this;
    }
}
//# sourceMappingURL=projectConfiguration.model.js.map