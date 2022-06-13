import { AppConfigs } from "./config/app_configs/index.js";
import { DatabaseConfiguration } from "./config/databaseConfiguration.js";
import { ModuleConfiguration } from "./config/moduleConfiguration.js";
import { ModuleBase } from "./shared/models/moduleBase.js";
export declare class App {
    private appConfigs;
    private databaseService;
    private moduleConfiguration;
    private readonly client;
    private logger;
    constructor(appConfigs: AppConfigs, databaseService: DatabaseConfiguration, moduleConfiguration: ModuleConfiguration);
    init(): Promise<void>;
    run(): Promise<string>;
    get modules(): ModuleBase[];
}
export declare function botMain(): Promise<void>;
//# sourceMappingURL=app.d.ts.map