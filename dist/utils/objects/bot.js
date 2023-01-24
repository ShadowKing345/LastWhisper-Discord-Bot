import { Client, GatewayIntentBits, Collection } from "discord.js";
import { Logger } from "../../config/logger.js";
export class Bot extends Client {
    projectConfiguration;
    databaseService;
    moduleConfiguration;
    logger = new Logger(Bot);
    events = new Collection();
    constructor(appConfig, databaseService, moduleConfiguration) {
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
        if (this.isReady()) {
            this.destroy();
        }
        await this.databaseService.disconnect();
        this.logger.info("Done. Have a nice day!");
    }
    get modules() {
        return this.moduleConfiguration?.modules ?? [];
    }
}
//# sourceMappingURL=bot.js.map