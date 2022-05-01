import chalk from "chalk";

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
        logger.info("Loading Configurations", { context: "ClientSetup" });
        initConfigs();
        if (CONFIGS.logging_level) {
            logger.level = CONFIGS.logging_level;
        }

        logger.info("Creating Db Client", { context: "ClientSetup" });
        await connectClient();

        logger.info("Loading modules.", { context: "ClientSetup" });
        configureModules(this.client);

        this.client.once("ready", () => {logger.info(chalk.magentaBright("Bot is up and ready to roll!"), { context: "ClientRuntime" });});
        this.client.on("error", error => {logger.info(`${error.name}: ${error.message}`, { context: "ClientRuntime" });});

        logger.log("info", `Done loading. ${chalk.green("Ready to run.")}`, { context: "ClientSetup" });
    }

    public async run() {
        return this.client.login(CONFIGS.token);
    }
}

export async function botMain() {
    const app: App = new App();
    await app.load();

    await app.run();
}