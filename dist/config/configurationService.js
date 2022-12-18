import { container as globalContainer } from "tsyringe";
import fs from "fs";
import { flattenObject, deepMerge } from "../utils/index.js";
import { ProjectConfiguration } from "../utils/objects/index.js";
export class ConfigurationService {
    static configPath = process.env.CONFIG_PATH ?? "./config/default.json";
    static devConfigPath = process.env.DEV_CONFIG_PATH ?? "./config/development.json";
    static flattenConfigs = new Map();
    static RegisterConfiguration(key, entity, container = globalContainer) {
        if (ConfigurationService.flattenConfigs.size < 1) {
            this.getConfigs();
        }
        const map = ConfigurationService.flattenConfigs;
        if (!map.has(key)) {
            throw new Error(`Configuration file has no config with the key ${key}`);
        }
        const e = deepMerge(new entity(), map.get(key));
        container.register(entity, { useValue: e });
    }
    static getConfigs() {
        ConfigurationService.flattenConfigs.clear();
        const config = ConfigurationService.parseConfigs();
        for (const [key, value] of Object.entries(flattenObject(config, true))) {
            ConfigurationService.flattenConfigs.set(key, value);
        }
        ConfigurationService.flattenConfigs.set("", config);
    }
    static readFile(path) {
        if (!(path && fs.existsSync(path))) {
            return null;
        }
        return fs.readFileSync(path, "utf-8");
    }
    static parseConfigFile(path) {
        const objStr = ConfigurationService.readFile(path);
        if (!objStr) {
            return null;
        }
        return deepMerge(ProjectConfiguration, JSON.parse(objStr));
    }
    static parseConfigs() {
        const config = ConfigurationService.parseConfigFile(ConfigurationService.configPath);
        if (process.env.NODE_ENV !== "development") {
            return config;
        }
        const devConfig = ConfigurationService.parseConfigFile(ConfigurationService.devConfigPath);
        return devConfig ? deepMerge(config, devConfig) : config;
    }
}
//# sourceMappingURL=configurationService.js.map