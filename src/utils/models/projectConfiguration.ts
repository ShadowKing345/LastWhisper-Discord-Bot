import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.js";
import { DatabaseConfiguration } from "./databaseConfiguration.js";
import { ToJsonBase } from "../objects/toJsonBase.js";
import { deepMerge } from "../index.js";
import { LoggerConfigs } from "./loggerConfigs.js";

/**
 * Default configuration object for the application.
 */
export class ProjectConfiguration extends ToJsonBase<ProjectConfiguration> {
    // Discord application token.
    public token?: string = null;
    // Database settings.
    public database?: DatabaseConfiguration = new DatabaseConfiguration();
    // Configuration for command registration.
    public commandRegistration?: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();
    // Configuration for logger.
    public logger?: LoggerConfigs = new LoggerConfigs();

    public merge(obj: ProjectConfiguration): ProjectConfiguration {
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

