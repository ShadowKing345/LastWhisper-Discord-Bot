import {Db, MongoClient} from "mongodb";
import {CONFIGS} from "./appConfigs.js";
import {logger} from "../utils/logger.js";
import {container} from "tsyringe";

export class Database extends Db {}

export let CLIENT: MongoClient;
export let DB: Database;

export async function connectClient(): Promise<MongoClient> {
    const url = CONFIGS.database?.url ?? `mongodb+srv://${CONFIGS.database.username}:${CONFIGS.database.password}@${CONFIGS.database.host}${CONFIGS.database.port ? ":" + CONFIGS.database.port : ""}/${CONFIGS.database.database}?${CONFIGS.database.query}`;

    if (!CLIENT) {
        CLIENT = await MongoClient.connect(url);
        CLIENT.on("error", error => {
            logger.error(error.message, {context: "DatabaseConfiguration"});
            CLIENT.close();
        });
        container.register<MongoClient>(MongoClient, {useValue: CLIENT});
    }

    if (!DB) {
        DB = CLIENT.db(CONFIGS.database.database);
        container.register<Database>(Database, {useValue: DB});
    }

    return CLIENT;
}
