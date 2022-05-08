declare type GenerateConfigsArgs = {
    token?: string;
    loggingLevel?: string;
    clientId?: string;
    guildId?: string;
    registerForGuild?: boolean;
    unregister?: boolean;
    username?: string;
    password?: string;
    host?: string;
    port?: string;
    databaseName?: string;
    query?: string;
    url?: string;
    useDns?: boolean;
    minimal?: boolean;
    new?: boolean;
    dev?: boolean;
};
export declare function generateConfigs(args: GenerateConfigsArgs): Promise<void>;
export {};
//# sourceMappingURL=generateConfiguration.d.ts.map