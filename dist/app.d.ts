import { pino } from "pino";
import { DatabaseService } from "./config/databaseService.js";
import { ModuleConfigurationService } from "./config/moduleConfigurationService.js";
import { Module, ProjectConfiguration } from "./utils/objects/index.js";
export declare class App {
    private appConfig;
    private databaseService;
    private moduleConfiguration;
    private logger;
    private readonly client;
    constructor(appConfig: ProjectConfiguration, databaseService: DatabaseService, moduleConfiguration: ModuleConfigurationService, logger: pino.Logger);
    init(): Promise<void>;
    run(): Promise<string>;
    stop(): Promise<void>;
    get modules(): Module[];
}
export declare function main(): Promise<void>;
//# sourceMappingURL=app.d.ts.map