import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.model.js";
import { DatabaseConfiguration } from "./databaseConfiguration.model.js";
import { ToJsonBase } from "../objects/toJsonBase.js";
import { deepMerge } from "../index.js";
/**
 * Default configuration object for the application.
 */
export class ProjectConfiguration extends ToJsonBase {
    // Discord application token.
    token = null;
    // Database settings.
    database = new DatabaseConfiguration();
    // Sets which level of logs can be seen.
    logging_level = "info";
    // Configuration for command registration.
    commandRegistration = new CommandRegistrationConfiguration();
    sanitizeObject(obj) {
        Object.assign(this, obj);
        this.database = deepMerge(new DatabaseConfiguration, this.database);
        this.commandRegistration = deepMerge(new CommandRegistrationConfiguration, this.database);
        return this;
    }
}
//# sourceMappingURL=projectConfiguration.model.js.map