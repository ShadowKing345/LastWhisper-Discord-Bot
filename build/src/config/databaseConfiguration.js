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
var DatabaseConfiguration_1;
import { Db, MongoClient } from "mongodb";
import { pino } from "pino";
import { container, injectWithTransform, singleton } from "tsyringe";
import { ConfigurationClass } from "../shared/configuration.class.js";
import { LoggerFactory, LoggerFactoryTransformer } from "../shared/logger.js";
import { AppConfigs, DatabaseConfiguration as DbConfig } from "./app_configs/index.js";
export class Database extends Db {
}
let DatabaseConfiguration = DatabaseConfiguration_1 = class DatabaseConfiguration extends ConfigurationClass {
    appConfigs;
    logger;
    _client;
    _db;
    constructor(appConfigs, logger) {
        super();
        this.appConfigs = appConfigs;
        this.logger = logger;
    }
    parseUrl(dbConfig) {
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
    async connectClient() {
        const url = this.parseUrl(this.appConfigs.config.database ?? new DbConfig());
        if (!this._client) {
            this._client = await MongoClient.connect(url);
            this._client.on("error", error => {
                this.logger.error(error.message, { context: "DatabaseConfiguration" });
                this._client.close();
            });
            container.register(MongoClient, { useValue: this._client });
            process.once("SIGINT", () => this._client.close());
            process.once("SIGTERM", () => this._client.close());
        }
        if (!this._db) {
            this._db = this._client.db(this.appConfigs.config.database?.database);
            container.register(Database, { useValue: this._db });
        }
        return this._client;
    }
    get db() {
        return this._db;
    }
    get client() {
        return this._client;
    }
};
DatabaseConfiguration = DatabaseConfiguration_1 = __decorate([
    singleton(),
    __param(1, injectWithTransform(LoggerFactory, LoggerFactoryTransformer, DatabaseConfiguration_1.name)),
    __metadata("design:paramtypes", [AppConfigs, Object])
], DatabaseConfiguration);
export { DatabaseConfiguration };
//# sourceMappingURL=databaseConfiguration.js.map