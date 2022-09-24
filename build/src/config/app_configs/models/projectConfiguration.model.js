import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.model.js";
import { DatabaseConfiguration } from "./databaseConfiguration.model.js";
export class ProjectConfiguration {
    token = null;
    database = new DatabaseConfiguration();
    logging_level = "info";
    commandRegistration = new CommandRegistrationConfiguration();
}
//# sourceMappingURL=projectConfiguration.model.js.map