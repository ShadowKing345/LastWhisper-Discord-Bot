import { Db, MongoClient } from "mongodb";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { ConfigurationClass } from "../configuration.class.js";
import { createLogger } from "../logger/logger.decorator.js";
import { ProjectConfiguration, DatabaseConfiguration } from "../models/index.js";

/**
 * Database Configuration Service file.
 * This service provides access to the database object as well as connection to the database server.
 */
@singleton()
export class DatabaseConfigurationService extends ConfigurationClass {
    private _client: MongoClient;
    private _db: Db;

    constructor(
        private projectConfig: ProjectConfiguration,
        @createLogger(DatabaseConfigurationService.name) private logger: pino.Logger,
    ) {
        super();
    }

    /**
     * Parses a given database configuration object into a valid url to be used.
     * @param dbConfig
     * @private
     */
    private static parseUrl(dbConfig: DatabaseConfiguration): string {
        if (dbConfig.url) {
            return dbConfig.url;
        }

        let url = `mongodb${dbConfig?.useDns && "+srv"}://`;
        url += `${encodeURIComponent(dbConfig.username)}:${encodeURIComponent(dbConfig.password)}`;
        url += `@${dbConfig.host}`;
        if (dbConfig.port) {
            url += `:${dbConfig.port}`;
        }
        if (dbConfig.database) {
            url += `/${encodeURIComponent(dbConfig.database)}`;
        }
        if (dbConfig.query) {
            const queryArray = Object.entries(dbConfig.query);
            if (queryArray.length > 0) {
                url += "?" + queryArray.map(value => `${value[0]}=${encodeURIComponent(value[1].toString())}`).join("&");
            }
        }
        return url;
    }

    /**
     * Attempts to establish a connection to the database.
     */
    async connect(): Promise<void> {
        try {
            this.logger.info(`Connecting to Database`);
            if (this.isConnected) {
                this.logger.error("Connection already active. Please disconnect first before attempting to connect.");
                return;
            }

            const url = DatabaseConfigurationService.parseUrl(this.projectConfig.database ?? new DatabaseConfiguration());
            console.log(url);

            this._client = await MongoClient.connect(url);
            this._client.on("error", async error => {
                this.logger.error(error + error.stack);
                await this._client?.close();
            });

            this._db = this._client.db(this.projectConfig.database?.database);
        } catch (error: Error | unknown) {
            this.logger.error(error instanceof Error ? error + error.stack : error);
            this._client = null;
            this._db = null;
        }
    }

    /**
     * Attempts to disconnect from the client.
     */
    public async disconnect(): Promise<void> {
        this.logger.info("Disconnecting from database.");
        await this._client?.close();

        this._client = null;
        this._db = null;
    }

    /**
     * Returns an instance of the database.
     * If none exists attempt to create a new one from the client.
     * Assuming that fails or there is no client will return null instead.
     */
    public get db(): Db {
        if (this._db) {
            return this._db;
        }

        if (!this._client) {
            return null;
        }

        this._db = this._client.db(this.projectConfig.database?.database);
        return this._db;
    }

    /**
     * Gets an instance of the client. Null if none were set.
     */
    public get client(): MongoClient {
        return this._client;
    }

    /**
     * Returns if the database is connected to or not.
     */
    public get isConnected(): boolean {
        return this._client != null;
    }
}