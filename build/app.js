var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadModules } from "./config/moduleConfiguration.js";
import { Client } from "./classes/client.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { CONFIGS, initConfigs } from "./config/appConfigs.js";
import { createDbClient } from "./config/databaseConfiguration.js";
import { logger } from "./utils/logger.js";
import chalk from "chalk";
export class App {
    constructor() {
        this.client = new Client();
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log("info", "Loading Configurations", { context: "ClientSetup" });
            initConfigs();
            if (CONFIGS.logging_level) {
                logger.level = CONFIGS.logging_level;
            }
            logger.log("info", "Creating Db Client", { context: "ClientSetup" });
            yield createDbClient();
            logger.log("info", "Loading modules.", { context: "ClientSetup" });
            loadModules(this.client);
            this.client.once("ready", () => {
                logger.log("info", chalk.magentaBright("Bot is up and ready to roll!"), { context: "ClientRuntime" });
            });
            this.client.on("error", (error) => __awaiter(this, void 0, void 0, function* () {
                logger.log("error", `${error.name}: ${error.message}`, { context: "ClientRuntime" });
            }));
            logger.log("info", `Done loading. ${chalk.green("Ready to run.")}`, { context: "ClientSetup" });
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.login(CONFIGS.token);
        });
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        dayjs.extend(duration);
        dayjs.extend(weekOfYear);
        dayjs.extend(advancedFormat);
        dayjs.extend(customParseFormat);
        const app = new App();
        yield app.load();
        yield app.run();
    });
}
main().catch(err => console.error(err));
//# sourceMappingURL=app.js.map