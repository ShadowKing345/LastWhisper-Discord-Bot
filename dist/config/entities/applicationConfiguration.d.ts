import { IMerge } from "../../utils/IMerge.js";
import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.js";
import { DatabaseConfiguration } from "./databaseConfiguration.js";
import { LoggerConfigs } from "./loggerConfigs.js";
import { ModuleConfiguration } from "./moduleConfiguration.js";
export declare class ApplicationConfiguration extends IMerge<ApplicationConfiguration> {
    token: string;
    database?: DatabaseConfiguration;
    commandRegistration?: CommandRegistrationConfiguration;
    logger?: LoggerConfigs;
    moduleConfiguration?: ModuleConfiguration;
    merge(obj: ApplicationConfiguration): ApplicationConfiguration;
}
//# sourceMappingURL=applicationConfiguration.d.ts.map