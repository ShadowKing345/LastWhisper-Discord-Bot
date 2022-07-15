import { pino } from "pino";
import { AppConfig } from "./config/app_configs/index.js";
import { DatabaseConfiguration } from "./config/databaseConfiguration.js";
import { ModuleConfiguration } from "./config/moduleConfiguration.js";
import { ModuleBase } from "./shared/models/moduleBase.js";
export declare class App {
    private appConfig;
    private databaseService;
    private moduleConfiguration;
    private logger;
    private readonly client;
    constructor(appConfig: AppConfig, databaseService: DatabaseConfiguration, moduleConfiguration: ModuleConfiguration, logger: pino.Logger);
    init(): Promise<void>;
    run(): Promise<string>;
    stop(): Promise<void>;
    get modules(): ModuleBase[];
}
export declare function botMain(): Promise<void>;
//# sourceMappingURL=app.d.ts.map