import fs from "fs";
import { ProjectConfiguration } from "../models/index.js";
import { toJson } from "../index.js";
import { container as defaultContainer } from "tsyringe";
export const configPath = process.env.CONFIG_PATH ?? "./config/ProjectConfiguration.json";
export const devConfigPath = process.env.DEV_CONFIG_PATH ?? "./config/ProjectConfiguration.dev.json";
/**
 * Parses the Json configuration file into a ProjectConfiguration Object.
 * @param path System path to config file.
 * @param devPath System path to dev config file.
 * @return New project configuration object.
 */
export function parseConfigFile(path, devPath) {
    if (!path || !fs.existsSync(path))
        return null;
    const config = toJson(ProjectConfiguration, fs.readFileSync(path, "utf-8"));
    if (!devPath || !fs.existsSync(devPath))
        return config;
    return Object.assign(config, JSON.parse(fs.readFileSync(devPath, "utf-8")));
}
/**
 * Generates and registers a configuration object.
 * @param container Dependency container to be used instead of the default one.
 */
export function generateConfigObject(container = defaultContainer) {
    if (!container.isRegistered(ProjectConfiguration)) {
        container.register(ProjectConfiguration, { useValue: parseConfigFile(configPath, devConfigPath) });
    }
}
//# sourceMappingURL=appConfigs.js.map