import { Client, GatewayIntentBits } from "discord.js";
import { ConfigurationService } from "../config/configurationService.js";
import { CommonConfigurationKeys, ModuleService } from "../config/index.js";
import { Logger } from "../config/logger.js";

/**
 * Application class.
 * To simplify dependency injection this class is used and can be easily resolved.
 */
export class Bot extends Client {
  private readonly appToken: string;
  private readonly moduleService: ModuleService;
  private readonly logger: Logger = new Logger(Bot);

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

  /**
   * Main function to initialize application.
   */
  public async init(): Promise<void> {
    try {
      await this.moduleService.configureModules(this);

      this.once("ready", () => this.logger.info("Bot is up and ready to roll!"));
      this.on("error", error => this.logger.error(error));

      this.logger.info("Done loading. Ready to run.");
    } catch (error) {
      this.logger.error("An unexpected error has resulted in the application failing to start.");
      this.logger.error(error);
    }
  }

  /**
   * Runs the bot.
   */
  public async run(): Promise<string> {
    return this.login(this.appToken);
  }

  /**
   * Stops everything and cleans up.
   */
  public async stop(): Promise<void> {
    this.logger.info("Stopping application.");

    await this.moduleService.cleanup();

    if (this.isReady()) {
      this.destroy();
    }

    this.logger.info("Done. Have a nice day!");
  }
}
