"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDbClient = exports.DB = void 0;
const mongodb_1 = require("mongodb");
const appConfigs_1 = require("./appConfigs");
async function createDbClient() {
    const client = await mongodb_1.MongoClient.connect(appConfigs_1.CONFIGS.dbUrl);
    exports.DB = client.db();
    client.on("error", error => {
        console.error(error);
        client.close();
    });
}
exports.createDbClient = createDbClient;
