import { Client, Collection, GatewayIntentBits } from "discord.js";
import { ConfigurationService } from "../config/configurationService.js";
import { CommonConfigurationKeys, ModuleService } from "../config/index.js";
import { Logger } from "../config/logger.js";
export class Bot extends Client {
    appToken;
    databaseService;
    moduleService;
    logger = new Logger(Bot);
    events = new Collection();
    constructor() {
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
        this.appToken = ConfigurationService.getConfiguration(CommonConfigurationKeys.TOKEN);
        this.moduleService = new ModuleService();
    }
    init() {
        try {
            this.moduleService.configureModules(this);
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
        return this.login(this.appToken);
    }
    async stop() {
        this.logger.info("Stopping application.");
        this.moduleService.cleanup();
        if (this.isReady()) {
            this.destroy();
        }
        await this.databaseService.disconnect();
        this.logger.info("Done. Have a nice day!");
    }
}
//# sourceMappingURL=bot.js.map