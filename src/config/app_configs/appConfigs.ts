import fs from "fs";
import { singleton } from "tsyringe";

import { ConfigurationClass } from "../../shared/configuration.class.js";
import { AppConfig } from "./models/index.js";

@singleton()
export class AppConfigs extends ConfigurationClass {
    public static readonly configPath = "./appConfigs.json";
    public static readonly devConfigPath = "./appConfigs-dev.json";
    private _config: AppConfig = null;

    constructor() {
        super();
        this.initConfigs();
    }

    public static parseConfigFile(path: string, devPath?: string): AppConfig {
        if (!path || !fs.existsSync(path)) return null;
        const config = Object.assign<AppConfig, object>(new AppConfig(), JSON.parse(fs.readFileSync(path, "utf-8")));

        if (!devPath || !fs.existsSync(devPath)) return config;
        return Object.assign<AppConfig, object>(config, JSON.parse(fs.readFileSync(devPath, "utf-8")));
    }

    public initConfigs(): AppConfig {
        if (!fs.existsSync(AppConfigs.configPath)) {
            throw new Error("Configuration file was not found. You can create one with the generate-config script.");
        }

        return this.config;
    }

    get config() {
        return this._config ??= AppConfigs.parseConfigFile(AppConfigs.configPath, AppConfigs.devConfigPath);
    }
}
