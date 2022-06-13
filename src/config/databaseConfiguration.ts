import { Db, MongoClient } from "mongodb";
import { pino } from "pino";
import { container, injectWithTransform, singleton } from "tsyringe";

import { ConfigurationClass } from "../shared/configuration.class.js";
import { LoggerFactory, LoggerFactoryTransformer } from "../shared/logger.js";
import { AppConfigs, DatabaseConfiguration as DbConfig } from "./app_configs/index.js";

export class Database extends Db {
}

@singleton()
export class DatabaseConfiguration extends ConfigurationClass {
    private _client: MongoClient;
    private _db: Database;

    constructor(
        private appConfigs: AppConfigs,
        @injectWithTransform(LoggerFactory, LoggerFactoryTransformer, DatabaseConfiguration.name) private logger: pino.Logger,
    ) {
        super();
    }

    parseUrl(dbConfig: DbConfig): string {
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

    async connectClient(): Promise<MongoClient> {
        const url = this.parseUrl(this.appConfigs.config.database ?? new DbConfig());

        if (!this._client) {
            this._client = await MongoClient.connect(url);
            this._client.on("error", error => {
                this.logger.error(error.message, { context: "DatabaseConfiguration" });
                this._client.close();
            });
            container.register<MongoClient>(MongoClient, { useValue: this._client });

            process.once("SIGINT", () => this._client.close());
            process.once("SIGTERM", () => this._client.close());
        }

        if (!this._db) {
            this._db = this._client.db(this.appConfigs.config.database?.database);
            container.register<Database>(Database, { useValue: this._db });
        }

        return this._client;
    }

    public get db(): Database {
        return this._db
    }

    public get client(): MongoClient {
        return this._client;
    }
}
