import fs from "fs";
import { ProjectConfiguration } from "../utils/objects/index.js";
import { toJson } from "../utils/index.js";
import { container as defaultContainer } from "tsyringe";
export const configPath = process.env.CONFIG_PATH ?? "./config/ProjectConfiguration.json";
export const devConfigPath = process.env.DEV_CONFIG_PATH ?? "./config/ProjectConfiguration.dev.json";
export function parseConfigFile(path, devPath) {
    if (!path || !fs.existsSync(path))
        return null;
    const config = toJson(new ProjectConfiguration(), fs.readFileSync(path, "utf-8"));
    if (!devPath || !fs.existsSync(devPath))
        return config;
    return toJson(config, fs.readFileSync(devPath, "utf-8"));
}
export function generateConfigObject(container = defaultContainer) {
    if (!container.isRegistered(ProjectConfiguration)) {
        const config = parseConfigFile(configPath, devConfigPath);
        if (!config) {
            throw new Error("Configuration file was not created.");
        }
        container.register(ProjectConfiguration, {
            useValue: config,
        });
    }
}
//# sourceMappingURL=appConfigs.js.map