import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.model.js";
import { DatabaseConfiguration } from "./databaseConfiguration.model.js";
import { ToJsonBase } from "../objects/toJsonBase.js";
/**
 * Default configuration object for the application.
 */
export declare class ProjectConfiguration extends ToJsonBase<ProjectConfiguration> {
    token?: string;
    database?: DatabaseConfiguration;
    logging_level?: string;
    commandRegistration?: CommandRegistrationConfiguration;
    merge(obj: ProjectConfiguration): ProjectConfiguration;
}
//# sourceMappingURL=projectConfiguration.model.d.ts.map