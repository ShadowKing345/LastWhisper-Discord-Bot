import { IMerge } from "../../utils/IMerge.js";
import { deepMerge } from "../../utils/index.js";
import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.js";
import { DatabaseConfiguration } from "./databaseConfiguration.js";
import { LoggerConfigs } from "./loggerConfigs.js";
import { ModuleConfiguration } from "./moduleConfiguration.js";

/**
 * Default configuration object for the application.
 */
export class ApplicationConfiguration extends IMerge<ApplicationConfiguration> {

    // Discord application token.
    public token: string = null;
    // Database settings.
    public database?: DatabaseConfiguration = new DatabaseConfiguration();
    // Configuration for command registration.
    public commandRegistration?: CommandRegistrationConfiguration = null;
    // Configuration for logger.
    public logger?: LoggerConfigs = new LoggerConfigs();
    // Configuration for module service.
    public moduleConfiguration?: ModuleConfiguration = new ModuleConfiguration();

    public merge( obj: ApplicationConfiguration ): ApplicationConfiguration {
        if( obj.token ) {
            this.token = obj.token;
        }

        if( obj.database ) {
            this.database = deepMerge( this.database ?? new DatabaseConfiguration(), obj.database );
        }

        if( obj.commandRegistration ) {
            this.commandRegistration = deepMerge(
                this.commandRegistration ?? new CommandRegistrationConfiguration(),
                obj.commandRegistration,
            );
        }

        if( obj.logger ) {
            this.logger = deepMerge( this.logger ?? new LoggerConfigs(), obj.logger );
        }

        if( obj.moduleConfiguration ) {
            this.moduleConfiguration = deepMerge(
                this.moduleConfiguration ?? new ModuleConfiguration(),
                obj.moduleConfiguration,
            );
        }

        return this;
    }
}
