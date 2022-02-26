var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from "mongodb";
import { CONFIGS } from "./appConfigs.js";
import { logger } from "../utils/logger.js";
export let DB;
export function createDbClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield MongoClient.connect(CONFIGS.dbUrl);
        DB = client.db();
        client.on("error", error => {
            logger.error(error.message, { context: "DatabaseConfiguration" });
            client.close();
        });
    });
}
//# sourceMappingURL=databaseConfiguration.js.map