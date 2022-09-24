import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.model.js";
import { DatabaseConfiguration } from "./databaseConfiguration.model.js";
import { ToJsonBase } from "../objects/toJsonBase.js";
import { deepMerge } from "../index.js";

/**
 * Default configuration object for the application.
 */
export class ProjectConfiguration extends ToJsonBase {
    // Discord application token.
    public token?: string = null;
    // Database settings.
    public database?: DatabaseConfiguration = new DatabaseConfiguration();
    // Sets which level of logs can be seen.
    public logging_level?: string = "info";
    // Configuration for command registration.
    public commandRegistration?: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();

    public sanitizeJson(obj: object): ProjectConfiguration {
        Object.assign(this, obj);

        this.database = deepMerge(new DatabaseConfiguration, this.database);
        this.commandRegistration = deepMerge(new CommandRegistrationConfiguration, this.database);

        return this;
    }
}

