import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.model.js";
import { DatabaseConfiguration } from "./databaseConfiguration.model.js";
import { ToJsonBase } from "../objects/toJsonBase.js";
import { deepMerge } from "../index.js";

/**
 * Default configuration object for the application.
 */
export class ProjectConfiguration extends ToJsonBase<ProjectConfiguration> {
    // Discord application token.
    public token?: string = null;
    // Database settings.
    public database?: DatabaseConfiguration = new DatabaseConfiguration();
    // Sets which level of logs can be seen.
    public logging_level?: string = "info";
    // Configuration for command registration.
    public commandRegistration?: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();

    public merge(obj: ProjectConfiguration): ProjectConfiguration {
        if (obj.token) {
            this.token = obj.token;
        }

        if (obj.logging_level) {
            this.logging_level = obj.logging_level;
        }

        if (obj.database) {
            this.database = deepMerge(this.database ?? new DatabaseConfiguration, obj.database);
        }

        if (obj.commandRegistration) {
            this.commandRegistration = deepMerge(this.commandRegistration ?? new CommandRegistrationConfiguration, this.commandRegistration);
        }

        return this;
    }
}

