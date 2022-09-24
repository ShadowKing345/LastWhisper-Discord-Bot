import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.model.js";
import { DatabaseConfiguration } from "./databaseConfiguration.model.js";

/**
 * Default configuration object for the application.
 */
export class ProjectConfiguration {
    // Discord application token.
    public token?: string = null;
    // Database settings.
    public database?: DatabaseConfiguration = new DatabaseConfiguration();
    // Sets which level of logs can be seen.
    public logging_level?: string = "info";
    // Configuration for command registration.
    public commandRegistration?: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();
}

