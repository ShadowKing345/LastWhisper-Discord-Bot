import chalk from "chalk";
import { container, singleton } from "tsyringe";

import { AppConfigs } from "./config/app_configs/index.js";
import { DatabaseConfiguration } from "./config/databaseConfiguration.js";
import { ModuleConfiguration } from "./config/moduleConfiguration.js";
import { buildLogger } from "./shared/logger.js";
import { Client } from "./shared/models/client.js";
import { ModuleBase } from "./shared/models/moduleBase.js";

@singleton()
export class App {
    private readonly client: Client;
    private logger = buildLogger(App.name);

    constructor(
        private appConfigs: AppConfigs,
        private databaseService: DatabaseConfiguration,
        private moduleConfiguration: ModuleConfiguration,
    ) {
        this.client = new Client();
    }

    public async init() {
        this.logger.info("Creating Db Client", { context: "ClientSetup" });
        await this.databaseService.connectClient();

        this.logger.info("Loading modules.", { context: "ClientSetup" });
        this.moduleConfiguration.configureModules(this.client);

        this.client.once("ready", () => {
            this.logger.info(chalk.magentaBright("Bot is up and ready to roll!"), { context: "ClientRuntime" });
        });
        this.client.on("error", error => {
            this.logger.info(`${error.name}: ${error.message}`, { context: "ClientRuntime" });
        });

        this.logger.info(`Done loading. ${chalk.green("Ready to run.")}`, { context: "ClientSetup" });
    }

    public async run() {
        return this.client.login(this.appConfigs.config.token);
    }

    public get modules(): ModuleBase[] {
        return this.moduleConfiguration?.modules ?? [];
    }
}

export async function botMain() {
    process.setMaxListeners(30);
    console.log("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");
    const app: App = container.resolve(App);
    await app.init();

    await app.run();
}