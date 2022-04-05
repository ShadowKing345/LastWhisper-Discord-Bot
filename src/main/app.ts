import chalk from "chalk";
import { extend } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import duration from "dayjs/plugin/duration.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";

import { Client } from "./classes/client.js";
import { CONFIGS, initConfigs } from "./config/appConfigs.js";
import { connectClient } from "./config/databaseConfiguration.js";
import { configureModules } from "./config/moduleConfiguration.js";
import { logger } from "./utils/logger.js";

export class App {
    private readonly client: Client;

    constructor() {
        this.client = new Client();
    }

    public async load() {
        logger.log("info", "Loading Configurations", { context: "ClientSetup" });
        initConfigs();
        if (CONFIGS.logging_level) {
            logger.level = CONFIGS.logging_level;
        }

        logger.log("info", "Creating Db Client", { context: "ClientSetup" });
        await connectClient();

        logger.log("info", "Loading modules.", { context: "ClientSetup" });
        configureModules(this.client);

        this.client.once("ready", () => {
            logger.log("info", chalk.magentaBright("Bot is up and ready to roll!"), { context: "ClientRuntime" });
        });
        this.client.on("error", error => {
            logger.log("error", `${error.name}: ${error.message}`, { context: "ClientRuntime" });
        });

        logger.log("info", `Done loading. ${chalk.green("Ready to run.")}`, { context: "ClientSetup" });
    }

    public async run() {
        return this.client.login(CONFIGS.token);
    }
}

async function main() {
    extend(duration);
    extend(weekOfYear);
    extend(advancedFormat);
    extend(customParseFormat);

    const app: App = new App();
    await app.load();

    await app.run();
}

try {
    await main();
} catch (error) {
    logger.error(error);
}
