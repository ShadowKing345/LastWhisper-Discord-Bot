import fs from "fs";
import { container } from "tsyringe";

import { AppConfig } from "./models/index.js";

export const configPath = "./appConfigs.json";
export const devConfigPath = "./appConfigs-dev.json";


export function parseConfigFile(path: string, devPath?: string): AppConfig {
    if (!path || !fs.existsSync(path)) return null;
    const config = Object.assign<AppConfig, object>(new AppConfig(), JSON.parse(fs.readFileSync(path, "utf-8")));

    if (!devPath || !fs.existsSync(devPath)) return config;
    return Object.assign<AppConfig, object>(config, JSON.parse(fs.readFileSync(devPath, "utf-8")));
}

if (!container.isRegistered(AppConfig)) {
    if (!fs.existsSync(configPath)) {
        throw new Error("Configuration file was not found. You can create one with the generate-config script.");
    }

    container.register<AppConfig>(AppConfig, { useValue: parseConfigFile(configPath, devConfigPath) })
}