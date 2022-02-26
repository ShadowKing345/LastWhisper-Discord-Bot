export declare let CONFIGS: AppConfigs;
export declare class AppConfigs {
    token: string;
    dbUrl: string;
    logging_level: string;
    commandRegistration: CommandRegistrationConfiguration;
}
export declare class CommandRegistrationConfiguration {
    clientId: string;
    guildId: string;
    registerForGuild: boolean;
    unregister: boolean;
}
export declare function initConfigs(): AppConfigs;
export declare class ConfigurationError extends Error {
}
