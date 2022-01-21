import fs from "fs";
import path from "path";

class Settings {
    public isDev: boolean;
    public production: AppConfigs;
    public development: AppConfigs;
}

export class AppConfigs {
    private token: string;
    private clientId: string;
    private dbUrl: string;
    private guildId;

    public get getToken() {
        return this.token;
    };

    public get getClientId() {
        return this.clientId;
    }

    public get getDBUrl() {
        return this.dbUrl;
    }

    public get getGuildId() {
        return this.guildId;
    }
}

export function getConfigs(): AppConfigs {
    const rawData = fs.readFileSync(path.resolve(__dirname, "../../resources/appConfigs.json"), "utf8");
    const settings: Settings = Object.assign(new Settings, JSON.parse(rawData));

    return settings.isDev ? Object.assign(new AppConfigs, settings.production, settings.development) : Object.assign(new AppConfigs, settings.production);
}