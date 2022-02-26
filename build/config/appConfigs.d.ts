export declare let CONFIGS: AppConfigs;
export declare class AppConfigs {
    token: string;
    clientId: string;
    dbUrl: string;
    guildId: string;
    registerGuildCommands: boolean;
    logging_level: string;
}
export declare function initConfigs(): AppConfigs;
