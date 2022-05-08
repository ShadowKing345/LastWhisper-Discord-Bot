import chalk from "chalk";
import { Client } from "./classes/client.js";
import { CONFIGS, initConfigs } from "./config/appConfigs.js";
import { connectClient } from "./config/databaseConfiguration.js";
import { configureModules } from "./config/moduleConfiguration.js";
import { logger } from "./utils/logger.js";
export class App {
    client;
    constructor() {
        this.client = new Client();
    }
    async init() {
        logger.info("Loading Configurations", { context: "ClientSetup" });
        initConfigs();
        if (CONFIGS.logging_level) {
            logger.level = CONFIGS.logging_level;
        }
        logger.info("Creating Db Client", { context: "ClientSetup" });
        await connectClient();
        logger.info("Loading modules.", { context: "ClientSetup" });
        configureModules(this.client);
        this.client.once("ready", () => {
            logger.info(chalk.magentaBright("Bot is up and ready to roll!"), { context: "ClientRuntime" });
        });
        this.client.on("error", error => {
            logger.info(`${error.name}: ${error.message}`, { context: "ClientRuntime" });
        });
        logger.log("info", `Done loading. ${chalk.green("Ready to run.")}`, { context: "ClientSetup" });
    }
    async run() {
        return this.client.login(CONFIGS.token);
    }
}
export async function botMain() {
    console.log("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");
    const app = new App();
    await app.init();
    await app.run();
}
//# sourceMappingURL=app.js.map