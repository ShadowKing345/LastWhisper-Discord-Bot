import chalk from "chalk";
import { pino } from "pino";
import { container, singleton } from "tsyringe";

import { DatabaseConfigurationService } from "./utils/config/databaseConfigurationService.js";
import { ModuleConfigurationService } from "./utils/config/moduleConfigurationService.js";
import { createLogger } from "./utils/loggerService.js";
import { Client } from "./utils/models/client.js";
import { ModuleBase, ProjectConfiguration } from "./utils/models/index.js";
import { generateConfigObject } from "./utils/config/appConfigs.js";
import { BuffManagerRepository } from "./repositories/buffManager.repository.js";

/**
 * Application class.
 * To simplify dependency injection this class is used and can be easily resolved.
 */
@singleton()
export class App {
    private readonly client: Client;

    constructor(
        private appConfig: ProjectConfiguration,
        private databaseService: DatabaseConfigurationService,
        private moduleConfiguration: ModuleConfigurationService,
        @createLogger(App.name) private logger: pino.Logger,
    ) {
        this.client = new Client();
    }

    /**
     * Main function to initialize application.
     */
    public async init(): Promise<void> {
        try {
            await this.databaseService.connect();
            this.moduleConfiguration.configureModules(this.client);

            this.client.once("ready", () => this.logger.info(chalk.magentaBright("Bot is up and ready to roll!")));
            this.client.on("error", error => this.logger.error(error + error.stack));

            this.logger.info(chalk.magenta("Done loading. Ready to run."));
        } catch (error: Error | unknown) {
            this.logger.error(chalk.red("An unexpected error has resulted in the application failing to start."));
            this.logger.error(error instanceof Error ? error + error.stack : error);
        }
    }

    /**
     * Runs the bot.
     */
    public async run(): Promise<string> {
        return this.client.login(this.appConfig.token);
    }

    /**
     * Stops everything and cleans up.
     */
    public async stop(): Promise<void> {
        this.logger.info("Stopping application.");
        this.moduleConfiguration.cleanup();
        this.client.destroy();
        await this.databaseService.disconnect();
        this.logger.info("Done. Have a nice day!");
    }

    /**
     * Returns all the registered modules from the module class.
     */
    public get modules(): ModuleBase[] {
        return this.moduleConfiguration?.modules ?? [];
    }
}

/**
 * Main function of application.
 * Should be used as starting point if bot needs to be started.
 */
export async function main() {
    process.setMaxListeners(30);
    console.log("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");

    try {
        generateConfigObject();

        const app: App = container.resolve(App);
        const db = container.resolve<BuffManagerRepository>(BuffManagerRepository);

        // await app.init();

        process.on("SIGTERM", () => app.stop())
            .on("SIGINT", () => app.stop())
            .on("uncaughtException", () => app.stop());

        // await app.run();
    } catch (error: Error | unknown) {
        console.error(error instanceof Error ? error + error.stack : error);
    }
}