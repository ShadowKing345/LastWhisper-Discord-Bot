import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.model.js";
import { DatabaseConfiguration } from "./databaseConfiguration.model.js";
export class AppConfig {
    token = null;
    database = new DatabaseConfiguration();
    logging_level = "info";
    commandRegistration = new CommandRegistrationConfiguration();
}
//# sourceMappingURL=appConfigs.model.js.map