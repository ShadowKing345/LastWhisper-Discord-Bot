import * as fs from "fs";

export const configPath = "./appConfigs.json", devConfigPath = "./appConfigs-dev.json";

export let CONFIGS: AppConfigs = null;

export class AppConfigs {
    public token: string;
    public database: DatabaseConfiguration;
    public logging_level: string = "info";
    public commandRegistration: CommandRegistrationConfiguration;
}

export class CommandRegistrationConfiguration {
    public clientId: string;
    public guildId: string;
    public registerForGuild: boolean = true;
    public unregister: boolean = false;
}

export class DatabaseConfiguration {
    public username: string;
    public password: string;
    public host: string;
    public port: string;
    public database: string;
    public query: { [key: string]: object };
    public url: string;
    public useDns: boolean = false;
}

export function parseConfigFile(): AppConfigs {
    if (!fs.existsSync(configPath)) {
        return null;
    }

    const config = Object.assign<AppConfigs, object>(new AppConfigs(), JSON.parse(fs.readFileSync(configPath, "utf-8")));
    if (!fs.existsSync(devConfigPath)) {
        return config;
    }

    return Object.assign<AppConfigs, object>(config, JSON.parse(fs.readFileSync(devConfigPath, "utf-8")));
}

export function initConfigs(): AppConfigs {
    if (!fs.existsSync(configPath)) {
        throw new Error("Configuration file was not found. You can create one with the generate-config script.");
    }

    return CONFIGS ??= parseConfigFile();
}