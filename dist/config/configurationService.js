import { container as globalContainer } from "tsyringe";
import fs from "fs";
import { flattenObject, deepMerge } from "../utils/index.js";
export class ConfigurationService {
    static configPath = process.env.CONFIG_PATH ?? "./config/ProjectConfiguration.json";
    static devConfigPath = process.env.DEV_CONFIG_PATH ?? "./config/ProjectConfiguration.dev.json";
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
        const configStr = ConfigurationService.readFile(ConfigurationService.configPath);
        if (!configStr) {
            return;
        }
        for (const [k, v] of Object.entries(flattenObject(JSON.parse(configStr), true))) {
            ConfigurationService.flattenConfigs.set(k, v);
        }
        ConfigurationService.flattenConfigs.set("", JSON.parse(configStr));
        const devConfigStr = ConfigurationService.readFile(ConfigurationService.devConfigPath);
        if (!devConfigStr) {
            return;
        }
        for (const [k, v] of Object.entries(flattenObject(JSON.parse(devConfigStr), true))) {
            ConfigurationService.flattenConfigs.set(k, v);
        }
    }
    static readFile(path) {
        if (!(path && fs.existsSync(path))) {
            return null;
        }
        return fs.readFileSync(path, "utf-8");
    }
}
//# sourceMappingURL=configurationService.js.map