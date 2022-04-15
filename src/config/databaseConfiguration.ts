import { Db, MongoClient } from "mongodb";
import { container } from "tsyringe";

import { logger } from "../utils/logger.js";
import { CONFIGS, DatabaseConfiguration } from "./appConfigs.js";

export class Database extends Db {
}

export let CLIENT: MongoClient;
export let DB: Database;

export function parseUrl(dbConfig: DatabaseConfiguration): string {
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

export async function connectClient(): Promise<MongoClient> {
    const url = parseUrl(CONFIGS.database ?? new DatabaseConfiguration());

    if (!CLIENT) {
        CLIENT = await MongoClient.connect(url);
        CLIENT.on("error", error => {
            logger.error(error.message, { context: "DatabaseConfiguration" });
            CLIENT.close();
        });
        container.register<MongoClient>(MongoClient, { useValue: CLIENT });

        process.once("SIGINT", () => CLIENT.close());
        process.once("SIGTERM", () => CLIENT.close());
    }

    if (!DB) {
        DB = CLIENT.db(CONFIGS.database?.database);
        container.register<Database>(Database, { useValue: DB });
    }

    return CLIENT;
}
