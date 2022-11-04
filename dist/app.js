var App_1;
import { __decorate, __metadata, __param } from "tslib";
import { pino } from "pino";
import { container, singleton } from "tsyringe";
import { DatabaseConfigurationService } from "./utils/config/databaseConfigurationService.js";
import { ModuleConfigurationService } from "./utils/config/moduleConfigurationService.js";
import { createLogger } from "./utils/loggerService.js";
import { Client } from "./utils/models/client.js";
import { ProjectConfiguration } from "./utils/models/index.js";
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
    async init() {
        try {
            await this.databaseService.connect();
            this.moduleConfiguration.configureModules(this.client);
            this.client.once("ready", () => this.logger.info("Bot is up and ready to roll!"));
            this.client.on("error", (error) => this.logger.error(error.stack));
            this.logger.info("Done loading. Ready to run.");
        }
        catch (error) {
            this.logger.error("An unexpected error has resulted in the application failing to start.");
            this.logger.error(error instanceof Error ? error.stack : error);
        }
    }
    async run() {
        return this.client.login(this.appConfig.token);
    }
    async stop() {
        this.logger.info("Stopping application.");
        this.moduleConfiguration.cleanup();
        this.client.destroy();
        await this.databaseService.disconnect();
        this.logger.info("Done. Have a nice day!");
    }
    get modules() {
        return this.moduleConfiguration?.modules ?? [];
    }
};
App = App_1 = __decorate([
    singleton(),
    __param(3, createLogger(App_1.name)),
    __metadata("design:paramtypes", [ProjectConfiguration,
        DatabaseConfigurationService,
        ModuleConfigurationService, Object])
], App);
export { App };
export async function main() {
    process.setMaxListeners(30);
    console.log("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");
    let app;
    try {
        app = container.resolve(App);
        await app.init();
        await app.run();
    }
    catch (error) {
        console.error(error instanceof Error ? error.stack : error);
    }
}
//# sourceMappingURL=app.js.map