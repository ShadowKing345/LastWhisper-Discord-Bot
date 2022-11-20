import { pino } from "pino";
import { DatabaseConfigurationService } from "./utils/config/databaseConfigurationService.js";
import { ModuleConfigurationService } from "./utils/config/moduleConfigurationService.js";
import { Module, ProjectConfiguration } from "./utils/models/index.js";
export declare class App {
    private appConfig;
    private databaseService;
    private moduleConfiguration;
    private logger;
    private readonly client;
    constructor(appConfig: ProjectConfiguration, databaseService: DatabaseConfigurationService, moduleConfiguration: ModuleConfigurationService, logger: pino.Logger);
    init(): Promise<void>;
    run(): Promise<string>;
    stop(): Promise<void>;
    get modules(): Module[];
}
export declare function main(): Promise<void>;
//# sourceMappingURL=app.d.ts.map