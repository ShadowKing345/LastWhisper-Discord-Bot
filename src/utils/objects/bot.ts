import { Client, ClientEvents, Collection, GatewayIntentBits } from "discord.js";
import { ApplicationConfiguration, DatabaseService, ModuleService } from "../../config/index.js";
import { Logger } from "../../config/logger.js";
import { Module } from "../../modules/module.js";
import { EventListeners } from "./eventListener.js";

/**
 * Application class.
 * To simplify dependency injection this class is used and can be easily resolved.
 */
export class Bot extends Client {
  private readonly projectConfiguration: ApplicationConfiguration;
  private readonly databaseService: DatabaseService;
  private readonly moduleConfiguration: ModuleService;
  private readonly logger: Logger = new Logger(Bot);

  public readonly events: Collection<keyof ClientEvents, EventListeners> = new Collection<keyof ClientEvents, EventListeners>();

  constructor(
    appConfig: ApplicationConfiguration,
  ) {
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
  }

  /**
   * Main function to initialize application.
   */
  public async init(): Promise<void> {
    try {
      await this.databaseService.connect();
      this.moduleConfiguration.configureModules(this);

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
    return this.login(this.projectConfiguration.token);
  }

  /**
   * Stops everything and cleans up.
   */
  public async stop(): Promise<void> {
    this.logger.info("Stopping application.");

    this.moduleConfiguration.cleanup();

    if (this.isReady()) {
      this.destroy();
    }

    await this.databaseService.disconnect();

    this.logger.info("Done. Have a nice day!");
  }

  /**
   * Returns all the registered modules from the module class.
   */
  public get modules(): Module[] {
    return this.moduleConfiguration?.modules ?? [];
  }
}
