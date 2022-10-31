import { Db, MongoClient } from "mongodb";
import { pino } from "pino";
import { ProjectConfiguration } from "../models/index.js";
import { ConfigurationClass } from "../configurationClass.js";
export declare class DatabaseConfigurationService extends ConfigurationClass {
    private projectConfig;
    private logger;
    private _client;
    private _db;
    constructor(projectConfig: ProjectConfiguration, logger: pino.Logger);
    private static parseUrl;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get db(): Db | null;
    get client(): MongoClient | null;
    get isConnected(): boolean;
}
//# sourceMappingURL=databaseConfigurationService.d.ts.map