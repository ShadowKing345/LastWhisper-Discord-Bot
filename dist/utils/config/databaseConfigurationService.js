var DatabaseConfigurationService_1;
import { __decorate, __metadata, __param } from "tslib";
import { MongoClient } from "mongodb";
import { pino } from "pino";
import { singleton } from "tsyringe";
import { createLogger } from "../loggerService.js";
import { ProjectConfiguration, DatabaseConfiguration } from "../models/index.js";
import { ConfigurationClass } from "../configurationClass.js";
let DatabaseConfigurationService = DatabaseConfigurationService_1 = class DatabaseConfigurationService extends ConfigurationClass {
    projectConfig;
    logger;
    _client = null;
    _db = null;
    constructor(projectConfig, logger) {
        super();
        this.projectConfig = projectConfig;
        this.logger = logger;
    }
    static parseUrl(dbConfig) {
        if (dbConfig.url) {
            return dbConfig.url;
        }
        let url = `mongodb${dbConfig?.useDns && "+srv"}://`;
        url += `${encodeURIComponent(dbConfig.username ?? "")}:${encodeURIComponent(dbConfig.password ?? "")}`;
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
    async connect() {
        try {
            this.logger.info(`Connecting to Database`);
            if (this.isConnected) {
                this.logger.error("Connection already active. Please disconnect first before attempting to connect.");
                return;
            }
            const url = DatabaseConfigurationService_1.parseUrl(this.projectConfig.database ?? new DatabaseConfiguration());
            this._client = await MongoClient.connect(url);
            this._client.on("error", error => this.logger.error(error.stack));
            this._db = this._client.db(this.projectConfig.database?.database ?? "");
        }
        catch (error) {
            this.logger.error(error instanceof Error ? error.stack : error);
            this._client = null;
            this._db = null;
        }
    }
    async disconnect() {
        this.logger.info("Disconnecting from database.");
        await this._client?.close();
        this._client = null;
        this._db = null;
    }
    get db() {
        if (this._db) {
            return this._db;
        }
        if (!this._client) {
            return null;
        }
        this._db = this._client.db(this.projectConfig.database?.database ?? "");
        return this._db;
    }
    get client() {
        return this._client;
    }
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