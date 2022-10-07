import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.js";
import { DatabaseConfiguration } from "./databaseConfiguration.js";
import { ToJsonBase } from "../objects/toJsonBase.js";
import { LoggerConfigs } from "./loggerConfigs.js";
/**
 * Default configuration object for the application.
 */
export declare class ProjectConfiguration extends ToJsonBase<ProjectConfiguration> {
    token?: string;
    database?: DatabaseConfiguration;
    commandRegistration?: CommandRegistrationConfiguration;
    logger?: LoggerConfigs;
    merge(obj: ProjectConfiguration): ProjectConfiguration;
}
//# sourceMappingURL=projectConfiguration.d.ts.map