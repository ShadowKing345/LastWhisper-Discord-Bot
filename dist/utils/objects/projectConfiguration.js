import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.js";
import { DatabaseConfiguration } from "./databaseConfiguration.js";
import { deepMerge } from "../index.js";
import { LoggerConfigs } from "./loggerConfigs.js";
import { ModuleConfiguration } from "./moduleConfiguration.js";
export class ProjectConfiguration {
    token = null;
    database = new DatabaseConfiguration();
    commandRegistration = new CommandRegistrationConfiguration();
    logger = new LoggerConfigs();
    moduleConfiguration = new ModuleConfiguration();
    merge(obj) {
        if (obj.token) {
            this.token = obj.token;
        }
        if (obj.database) {
            this.database = deepMerge(this.database ?? new DatabaseConfiguration(), obj.database);
        }
        if (obj.commandRegistration) {
            this.commandRegistration = deepMerge(this.commandRegistration ?? new CommandRegistrationConfiguration(), obj.commandRegistration);
        }
        if (obj.logger) {
            this.logger = deepMerge(this.logger ?? new LoggerConfigs(), obj.logger);
        }
        if (obj.moduleConfiguration) {
            this.moduleConfiguration = deepMerge(this.moduleConfiguration ?? new ModuleConfiguration(), obj.moduleConfiguration);
        }
        return this;
    }
}
//# sourceMappingURL=projectConfiguration.js.map