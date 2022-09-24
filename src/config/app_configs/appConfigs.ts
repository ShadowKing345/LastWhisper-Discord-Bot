import fs from "fs";
import { container } from "tsyringe";

import { ProjectConfiguration } from "./models/projectConfiguration.model.js";

export const configPath = "./appConfigs.json";
export const devConfigPath = "./appConfigs-dev.json";


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