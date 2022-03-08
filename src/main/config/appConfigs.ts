import * as fs from "fs";

const configPath = "./appConfigs.json", devConfigPath = "./appConfigs-dev.json";

export let CONFIGS: AppConfigs = null;

export class AppConfigs {
    public token: string;
    public database: DatabaseConfiguration;
    public logging_level: string;
    public commandRegistration: CommandRegistrationConfiguration;
}

export class CommandRegistrationConfiguration {
    public clientId: string;
    public guildId: string;
    public registerForGuild: boolean;
    public unregister: boolean;
}

export class DatabaseConfiguration {
    public username: string;
    public password: string;
    public host: string;
    public port: string;
    public database: string;
    public query: { [key: string]: object };
    public url: string;
    public useDns: boolean;
}

export function initConfigs(): AppConfigs {
    if (!fs.existsSync(configPath)) {
        throw new ConfigurationError("No configuration file named appConfigs.json found in root directory. Please create one.");
    }

    const raw = fs.readFileSync(configPath, "utf-8");
    let dev;

    if (fs.existsSync(devConfigPath)) {
        dev = fs.readFileSync(devConfigPath, "utf-8");
    }

    CONFIGS = Object.assign<AppConfigs, object>(new AppConfigs, JSON.parse(raw));

    if (dev) {
        Object.assign<AppConfigs, object>(CONFIGS, JSON.parse(dev));
    }

    return CONFIGS;
}

export class ConfigurationError extends Error {
}
