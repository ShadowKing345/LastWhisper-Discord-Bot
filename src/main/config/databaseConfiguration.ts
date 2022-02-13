import {Db, MongoClient} from "mongodb";
import {CONFIGS} from "./appConfigs.js";
import {logger} from "../utils/logger.js";

export let DB: Db;

export async function createDbClient() {
    const client = await MongoClient.connect(CONFIGS.dbUrl);
    DB = client.db();
    client.on("error", error => {
        logger.error(error.message, {context: "DatabaseConfiguration"});
        client.close();
    })
}