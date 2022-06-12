import chalk from "chalk";
import { CONFIGS, initConfigs } from "./config/appConfigs.js";
import { connectClient } from "./config/databaseConfiguration.js";
import { configureModules } from "./config/moduleConfiguration.js";
import { buildLogger } from "./shared/logger.js";
import { Client } from "./shared/models/client.js";
export class App {
    client;
    logger = buildLogger(App.name);
    constructor() {
        this.client = new Client();
    }
    async init() {
        this.logger.info("Loading Configurations", { context: "ClientSetup" });
        initConfigs();
        this.logger.info("Creating Db Client", { context: "ClientSetup" });
        await connectClient();
        this.logger.info("Loading modules.", { context: "ClientSetup" });
        configureModules(this.client);
        this.client.once("ready", () => {
            this.logger.info(chalk.magentaBright("Bot is up and ready to roll!"), { context: "ClientRuntime" });
        });
        this.client.on("error", error => {
            this.logger.info(`${error.name}: ${error.message}`, { context: "ClientRuntime" });
        });
        this.logger.info(`Done loading. ${chalk.green("Ready to run.")}`, { context: "ClientSetup" });
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