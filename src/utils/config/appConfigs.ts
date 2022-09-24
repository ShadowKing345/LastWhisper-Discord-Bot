import fs from "fs";
import { container } from "tsyringe";

import { ProjectConfiguration } from "../models/index.js";

export const configPath = "./appConfigs.json";
export const devConfigPath = "./appConfigs-dev.json";

/**
 * Parses the Json configuration file into a ProjectConfiguration Object.
 * @param path System path to config file.
 * @param devPath System path to dev config file.
 * @return New project configuration object.
 */
export function parseConfigFile(path: string, devPath?: string): ProjectConfiguration {
    if (!path || !fs.existsSync(path)) return null;
    const config = Object.assign<ProjectConfiguration, object>(new ProjectConfiguration(), JSON.parse(fs.readFileSync(path, "utf-8")));

    if (!devPath || !fs.existsSync(devPath)) return config;
    return Object.assign<ProjectConfiguration, object>(config, JSON.parse(fs.readFileSync(devPath, "utf-8")));
}

if (!container.isRegistered(ProjectConfiguration)) {
    if (!fs.existsSync(configPath)) {
        throw new Error("Configuration file was not found. You can create one with the generate-config script.");
    }

    container.register<ProjectConfiguration>(ProjectConfiguration, { useValue: parseConfigFile(configPath, devConfigPath) })
}