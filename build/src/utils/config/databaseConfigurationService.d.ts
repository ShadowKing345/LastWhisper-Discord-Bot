import { Db, MongoClient } from "mongodb";
import { pino } from "pino";
import { ProjectConfiguration } from "../models/index.js";
import { ConfigurationClass } from "../configurationClass.js";
/**
 * Database Configuration Service file.
 * This service provides access to the database object as well as connection to the database server.
 */
export declare class DatabaseConfigurationService extends ConfigurationClass {
    private projectConfig;
    private logger;
    private _client;
    private _db;
    constructor(projectConfig: ProjectConfiguration, logger: pino.Logger);
    /**
     * Parses a given database configuration object into a valid url to be used.
     * @param dbConfig
     * @private
     */
    private static parseUrl;
    /**
     * Attempts to establish a connection to the database.
     */
    connect(): Promise<void>;
    /**
     * Attempts to disconnect from the client.
     */
    disconnect(): Promise<void>;
    /**
     * Returns an instance of the database.
     * If none exists attempt to create a new one from the client.
     * Assuming that fails or there is no client will return null instead.
     */
    get db(): Db;
    /**
     * Gets an instance of the client. Null if none were set.
     */
    get client(): MongoClient;
    /**
     * Returns if the database is connected to or not.
     */
    get isConnected(): boolean;
}
//# sourceMappingURL=databaseConfigurationService.d.ts.map