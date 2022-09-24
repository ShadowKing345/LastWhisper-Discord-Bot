var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var App_1;
import chalk from "chalk";
import { pino } from "pino";
import { container, singleton } from "tsyringe";
import { DatabaseConfigurationService } from "./utils/config/databaseConfigurationService.js";
import { ModuleConfiguration } from "./utils/config/moduleConfiguration.js";
import { createLogger } from "./utils/logger/logger.decorator.js";
import { Client } from "./utils/models/client.js";
import { ProjectConfiguration } from "./utils/models/index.js";
import { generateConfigObject } from "./utils/config/appConfigs.js";
/**
 * Application class.
 * To simplify dependency injection this class is used and can be easily resolved.
 */
let App = App_1 = class App {
    appConfig;
    databaseService;
    moduleConfiguration;
    logger;
    client;
    constructor(appConfig, databaseService, moduleConfiguration, logger) {
        this.appConfig = appConfig;
        this.databaseService = databaseService;
        this.moduleConfiguration = moduleConfiguration;
        this.logger = logger;
        this.client = new Client();
    }
    /**
     * Main function to initialize application.
     */
    async init() {
        try {
            await this.databaseService.connect();
            this.moduleConfiguration.configureModules(this.client);
            this.client.once("ready", () => this.logger.info(chalk.magentaBright("Bot is up and ready to roll!")));
            this.client.on("error", error => this.logger.error(error + error.stack));
            this.logger.info(chalk.magenta("Done loading. Ready to run."));
        }
        catch (error) {
            this.logger.error(chalk.red("An unexpected error has resulted in the application failing to start."));
            this.logger.error(error instanceof Error ? error + error.stack : error);
        }
    }
    /**
     * Runs the bot.
     */
    async run() {
        return this.client.login(this.appConfig.token);
    }
    /**
     * Stops everything and cleans up.
     */
    async stop() {
        this.logger.info("Stopping application.");
        this.moduleConfiguration.cleanup();
        this.client.destroy();
        await this.databaseService.disconnect();
        this.logger.info("Done. Have a nice day!");
    }
    /**
     * Returns all the registered modules from the module class.
     */
    get modules() {
        return this.moduleConfiguration?.modules ?? [];
    }
};
App = App_1 = __decorate([
    singleton(),
    __param(3, createLogger(App_1.name)),
    __metadata("design:paramtypes", [ProjectConfiguration,
        DatabaseConfigurationService,
        ModuleConfiguration, Object])
], App);
export { App };
/**
 * Main function of application.
 * Should be used as starting point if bot needs to be started.
 */
export async function main() {
    process.setMaxListeners(30);
    console.log("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");
    try {
        generateConfigObject();
        const app = container.resolve(App);
        // await app.init();
        // process.on("SIGTERM", () => app.stop())
        //     .on("SIGINT", () => app.stop())
        //     .on("uncaughtException", () => app.stop());
        //
        // await app.run();
    }
    catch (error) {
        console.error(error instanceof Error ? error + error.stack : error);
    }
}
//# sourceMappingURL=app.js.map