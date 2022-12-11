var Bot_1;
import { __decorate, __metadata, __param } from "tslib";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { ProjectConfiguration } from "./projectConfiguration.js";
import { DatabaseService } from "../../config/databaseService.js";
import { ModuleConfigurationService } from "../../config/moduleConfigurationService.js";
import { createLogger } from "../../services/loggerService.js";
import { pino } from "pino";
import { singleton } from "tsyringe";
let Bot = Bot_1 = class Bot extends Client {
    projectConfiguration;
    databaseService;
    moduleConfiguration;
    logger;
    events = new Collection();
    constructor(appConfig, databaseService, moduleConfiguration, logger) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
            ],
        });
        this.projectConfiguration = appConfig;
        this.databaseService = databaseService;
        this.moduleConfiguration = moduleConfiguration;
        this.logger = logger;
    }
    async init() {
        try {
            await this.databaseService.connect();
            this.moduleConfiguration.configureModules(this);
            this.once("ready", () => this.logger.info("Bot is up and ready to roll!"));
            this.on("error", error => this.logger.error(error.stack));
            this.logger.info("Done loading. Ready to run.");
        }
        catch (error) {
            this.logger.error("An unexpected error has resulted in the application failing to start.");
            this.logger.error(error instanceof Error ? error.stack : error);
        }
    }
    async run() {
        return this.login(this.projectConfiguration.token);
    }
    async stop() {
        this.logger.info("Stopping application.");
        this.moduleConfiguration.cleanup();
        this.destroy();
        await this.databaseService.disconnect();
        this.logger.info("Done. Have a nice day!");
    }
    get modules() {
        return this.moduleConfiguration?.modules ?? [];
    }
};
Bot = Bot_1 = __decorate([
    singleton(),
    __param(3, createLogger(Bot_1.name)),
    __metadata("design:paramtypes", [ProjectConfiguration,
        DatabaseService,
        ModuleConfigurationService, Object])
], Bot);
export { Bot };
//# sourceMappingURL=bot.js.map