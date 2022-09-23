import { CommandRegistrationConfiguration } from "./commandRegistrationConfiguration.model.js";
import { DatabaseConfiguration } from "./databaseConfiguration.model.js";

export class ProjectConfiguration {
    public token?: string = null;
    public database?: DatabaseConfiguration = new DatabaseConfiguration();
    public logging_level?: string = "info";
    public commandRegistration?: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();
}

