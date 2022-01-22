import {Db, MongoClient} from "mongodb";
import {CONFIGS} from "./appConfigs";

export let DB: Db;

export async function createDbClient() {
    const client = await MongoClient.connect(CONFIGS.dbUrl);
    DB = client.db();
    client.on("error", error => {
        console.error(error);
        client.close();
    })
}