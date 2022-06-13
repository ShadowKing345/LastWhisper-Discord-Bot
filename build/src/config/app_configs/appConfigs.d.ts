import { ConfigurationClass } from "../../shared/configuration.class.js";
import { AppConfig } from "./models/index.js";
export declare class AppConfigs extends ConfigurationClass {
    static readonly configPath = "./appConfigs.json";
    static readonly devConfigPath = "./appConfigs-dev.json";
    private _config;
    constructor();
    static parseConfigFile(path: string, devPath?: string): AppConfig;
    initConfigs(): AppConfig;
    get config(): AppConfig;
}
//# sourceMappingURL=appConfigs.d.ts.map