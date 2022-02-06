import fs from "fs";

export let CONFIGS: AppConfigs = null;

class Settings {
    public production: AppConfigs;
    public development: AppConfigs;
}

export class AppConfigs {
    public token: string;
    public clientId: string;
    public dbUrl: string;
    public guildId: string;
    public registerGuildCommands: boolean;
    public logging_level: string;
}

export function initConfigs(): AppConfigs {
    const rawData = fs.readFileSync("./appConfigs.json", "utf8");
    const settings: Settings = Object.assign(new Settings, JSON.parse(rawData));

    CONFIGS = Object.assign(new AppConfigs, settings.production, settings.development);

    return CONFIGS;
}