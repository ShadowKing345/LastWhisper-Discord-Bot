import {Db, MongoClient} from "mongodb";
import {CONFIGS} from "./appConfigs.js";
import {logger} from "../utils/logger.js";
import {container} from "tsyringe";

export class Database extends Db {
}

export let CLIENT: MongoClient;
export let DB: Database;

export async function connectClient(): Promise<MongoClient> {
    const dbConfig = CONFIGS.database;
    let url;

    if (dbConfig?.url) {
        url = dbConfig.url;
    } else {
        url = `mongodb${dbConfig.useDns ? "+srv" : ""}://`;
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
    }

    console.log(url);

    if (!CLIENT) {
        CLIENT = await MongoClient.connect(url);
        CLIENT.on("error", error => {
            logger.error(error.message, {context: "DatabaseConfiguration"});
            CLIENT.close();
        });
        container.register<MongoClient>(MongoClient, {useValue: CLIENT});
    }

    if (!DB) {
        DB = CLIENT.db(dbConfig.database);
        container.register<Database>(Database, {useValue: DB});
    }

    return CLIENT;
}
