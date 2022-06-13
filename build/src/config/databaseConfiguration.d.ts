import { Db, MongoClient } from "mongodb";
import { pino } from "pino";
import { ConfigurationClass } from "../shared/configuration.class.js";
import { AppConfigs, DatabaseConfiguration as DbConfig } from "./app_configs/index.js";
export declare class Database extends Db {
}
export declare class DatabaseConfiguration extends ConfigurationClass {
    private appConfigs;
    private logger;
    private _client;
    private _db;
    constructor(appConfigs: AppConfigs, logger: pino.Logger);
    parseUrl(dbConfig: DbConfig): string;
    connectClient(): Promise<MongoClient>;
    get db(): Database;
    get client(): MongoClient;
}
//# sourceMappingURL=databaseConfiguration.d.ts.map