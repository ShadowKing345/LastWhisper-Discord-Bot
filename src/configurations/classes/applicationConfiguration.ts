import { deepMerge } from "../../utils/index.js";
import { Mergeable } from "../../utils/mergable.js";
import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.js";
import { DatabaseConfiguration } from "./databaseConfiguration.js";
import { LoggerConfigs } from "./loggerConfigs.js";
import { ModuleConfiguration } from "./moduleConfiguration.js";

/**
 * Default configuration object for the application.
 */
export class ApplicationConfiguration implements Mergeable<ApplicationConfiguration> {

    public token: string = null;
    public database?: DatabaseConfiguration = new DatabaseConfiguration();
    public commandRegistration?: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();
    public logger?: LoggerConfigs = new LoggerConfigs();
    public moduleConfiguration?: ModuleConfiguration = new ModuleConfiguration();

    public merge( obj: Partial<ApplicationConfiguration> ): ApplicationConfiguration {
        if( obj.token ) {
            this.token = obj.token;
        }

        if( obj.database ) {
            this.database = deepMerge( this.database ?? new DatabaseConfiguration(), obj.database );
        }

        if( obj.commandRegistration ) {
            this.commandRegistration = deepMerge( this.commandRegistration ?? new CommandRegistrationConfiguration(), obj.commandRegistration );
        }

        if( obj.logger ) {
            this.logger = deepMerge( this.logger ?? new LoggerConfigs(), obj.logger );
        }

        if( obj.moduleConfiguration ) {
            this.moduleConfiguration = ( this.moduleConfiguration ?? new ModuleConfiguration() ).merge( obj.moduleConfiguration );
        }

        return this;
    }
}
