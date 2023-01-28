import { Client, ClientEvents, Collection, GatewayIntentBits } from "discord.js";
import { ConfigurationService } from "../config/configurationService.js";
import { CommonConfigurationKeys, DatabaseService, ModuleService } from "../config/index.js";
import { Logger } from "../config/logger.js";
import { EventListeners } from "./eventListener.js";

/**
 * Application class.
 * To simplify dependency injection this class is used and can be easily resolved.
 */
export class Bot extends Client {
  private readonly appToken: string;
  private readonly databaseService: DatabaseService;
  private readonly moduleService: ModuleService;
  private readonly logger: Logger = new Logger(Bot);

  public readonly events: Collection<keyof ClientEvents, EventListeners> = new Collection<keyof ClientEvents, EventListeners>();

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
  public init(): void {
    try {
      this.moduleService.configureModules(this);

      this.once("ready", () => this.logger.info("Bot is up and ready to roll!"));
      this.on("error", error => this.logger.error(error.stack));

      this.logger.info("Done loading. Ready to run.");
    } catch (error) {
      this.logger.error("An unexpected error has resulted in the application failing to start.");
      this.logger.error(error instanceof Error ? error.stack : error);
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

    this.moduleService.cleanup();

    if (this.isReady()) {
      this.destroy();
    }

    await this.databaseService.disconnect();

    this.logger.info("Done. Have a nice day!");
  }
}
