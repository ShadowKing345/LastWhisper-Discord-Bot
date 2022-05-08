import { Db, MongoClient } from "mongodb";
import { DatabaseConfiguration } from "./appConfigs.js";
export declare class Database extends Db {
}
export declare let CLIENT: MongoClient;
export declare let DB: Database;
export declare function parseUrl(dbConfig: DatabaseConfiguration): string;
export declare function connectClient(): Promise<MongoClient>;
//# sourceMappingURL=databaseConfiguration.d.ts.map