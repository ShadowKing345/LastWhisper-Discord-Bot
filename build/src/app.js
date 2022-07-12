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
import { container, injectWithTransform, singleton } from "tsyringe";
import { AppConfig } from "./config/app_configs/index.js";
import { DatabaseConfiguration } from "./config/databaseConfiguration.js";
import { ModuleConfiguration } from "./config/moduleConfiguration.js";
import { LoggerFactory, LoggerFactoryTransformer } from "./shared/logger.js";
import { Client } from "./shared/models/client.js";
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
    async run() {
        return this.client.login(this.appConfig.token);
    }
    get modules() {
        return this.moduleConfiguration?.modules ?? [];
    }
};
App = App_1 = __decorate([
    singleton(),
    __param(3, injectWithTransform(LoggerFactory, LoggerFactoryTransformer, App_1.name)),
    __metadata("design:paramtypes", [AppConfig,
        DatabaseConfiguration,
        ModuleConfiguration, Object])
], App);
export { App };
export async function botMain() {
    process.setMaxListeners(30);
    console.log("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");
    const app = container.resolve(App);
    await app.init();
    await app.run();
}
//# sourceMappingURL=app.js.map