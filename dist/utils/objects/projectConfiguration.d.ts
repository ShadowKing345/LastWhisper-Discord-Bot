import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.js";
import { DatabaseConfiguration } from "./databaseConfiguration.js";
import { LoggerConfigs } from "./loggerConfigs.js";
import { ModuleConfiguration } from "./moduleConfiguration.js";
export declare class ProjectConfiguration {
    token: string;
    database?: DatabaseConfiguration;
    commandRegistration?: CommandRegistrationConfiguration;
    logger?: LoggerConfigs;
    moduleConfiguration: ModuleConfiguration;
    merge(obj: ProjectConfiguration): ProjectConfiguration;
}
//# sourceMappingURL=projectConfiguration.d.ts.map