var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseConfigurationService_1;
import { MongoClient } from "mongodb";
import { pino } from "pino";
import { singleton } from "tsyringe";
import { ConfigurationClass } from "../configuration.class.js";
import { createLogger } from "../loggerService.js";
import { ProjectConfiguration, DatabaseConfiguration } from "../models/index.js";
/**
 * Database Configuration Service file.
 * This service provides access to the database object as well as connection to the database server.
 */
let DatabaseConfigurationService = DatabaseConfigurationService_1 = class DatabaseConfigurationService extends ConfigurationClass {
    projectConfig;
    logger;
    _client;
    _db;
    constructor(projectConfig, logger) {
        super();
        this.projectConfig = projectConfig;
        this.logger = logger;
    }
    /**
     * Parses a given database configuration object into a valid url to be used.
     * @param dbConfig
     * @private
     */
    static parseUrl(dbConfig) {
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
    async connect() {
        try {
            this.logger.info(`Connecting to Database`);
            if (this.isConnected) {
                this.logger.error("Connection already active. Please disconnect first before attempting to connect.");
                return;
            }
            const url = DatabaseConfigurationService_1.parseUrl(this.projectConfig.database ?? new DatabaseConfiguration());
            this._client = await MongoClient.connect(url);
            this._client.on("error", async (error) => {
                this.logger.error(error + error.stack);
                await this._client?.close();
            });
            this._db = this._client.db(this.projectConfig.database?.database);
        }
        catch (error) {
            this.logger.error(error instanceof Error ? error + error.stack : error);
            this._client = null;
            this._db = null;
        }
    }
    /**
     * Attempts to disconnect from the client.
     */
    async disconnect() {
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
    get db() {
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
    get client() {
        return this._client;
    }
    /**
     * Returns if the database is connected to or not.
     */
    get isConnected() {
        return this._client != null;
    }
};
DatabaseConfigurationService = DatabaseConfigurationService_1 = __decorate([
    singleton(),
    __param(1, createLogger(DatabaseConfigurationService_1.name)),
    __metadata("design:paramtypes", [ProjectConfiguration, Object])
], DatabaseConfigurationService);
export { DatabaseConfigurationService };
//# sourceMappingURL=databaseConfigurationService.js.map