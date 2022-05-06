import fs from "fs";

export const configPath = "./appConfigs.json", devConfigPath = "./appConfigs-dev.json";

export let CONFIGS: AppConfigs = null;

export class AppConfigs {
    public token?: string = null;
    public database?: DatabaseConfiguration = new DatabaseConfiguration();
    public logging_level?: string = "info";
    public commandRegistration?: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();
}

export class CommandRegistrationConfiguration {
    public clientId?: string = null;
    public guildId?: string = null;
    public registerForGuild?: boolean = false;
    public unregister?: boolean = false;
}

export class DatabaseConfiguration {
    public username?: string = null;
    public password?: string = null;
    public host?: string = null;
    public port?: string = null;
    public database?: string = null;
    public query?: { [key: string]: any } = {};
    public url?: string = null;
    public useDns?: boolean = false;
}

export function parseConfigFile(path: string, devPath?: string): AppConfigs {
    if (!path || !fs.existsSync(path)) return null;
    const config = Object.assign<AppConfigs, object>(new AppConfigs(), JSON.parse(fs.readFileSync(path, "utf-8")));

    if (!devPath || !fs.existsSync(devPath)) return config;
    return Object.assign<AppConfigs, object>(config, JSON.parse(fs.readFileSync(devPath, "utf-8")));
}

export function initConfigs(): AppConfigs {
    if (!fs.existsSync(configPath)) throw new Error("Configuration file was not found. You can create one with the generate-config script.");

    return CONFIGS ??= parseConfigFile(configPath, devConfigPath);
}
