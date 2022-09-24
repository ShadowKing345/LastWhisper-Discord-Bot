import { pino } from "pino";
import { DatabaseConfigurationService } from "./utils/config/databaseConfigurationService.js";
import { ModuleConfiguration } from "./utils/config/moduleConfiguration.js";
import { ModuleBase, ProjectConfiguration } from "./utils/models/index.js";
/**
 * Application class.
 * To simplify dependency injection this class is used and can be easily resolved.
 */
export declare class App {
    private appConfig;
    private databaseService;
    private moduleConfiguration;
    private logger;
    private readonly client;
    constructor(appConfig: ProjectConfiguration, databaseService: DatabaseConfigurationService, moduleConfiguration: ModuleConfiguration, logger: pino.Logger);
    /**
     * Main function to initialize application.
     */
    init(): Promise<void>;
    /**
     * Runs the bot.
     */
    run(): Promise<string>;
    /**
     * Stops everything and cleans up.
     */
    stop(): Promise<void>;
    /**
     * Returns all the registered modules from the module class.
     */
    get modules(): ModuleBase[];
}
/**
 * Main function of application.
 * Should be used as starting point if bot needs to be started.
 */
export declare function main(): Promise<void>;
//# sourceMappingURL=app.d.ts.map