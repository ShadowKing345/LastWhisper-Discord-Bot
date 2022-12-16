import { Client, GatewayIntentBits, Collection, ClientEvents } from "discord.js";
import { EventListeners } from "./eventListener.js";
import { ProjectConfiguration } from "./projectConfiguration.js";
import { DatabaseService } from "../../config/databaseService.js";
import { ModuleService } from "../../config/moduleService.js";
import { Module } from "../../modules/module.js";
import { singleton } from "tsyringe";
import { Logger } from "../logger.js";

/**
 * Application class.
 * To simplify dependency injection this class is used and can be easily resolved.
 */
@singleton()
export class Bot extends Client {
  private readonly projectConfiguration: ProjectConfiguration;
  private readonly databaseService: DatabaseService;
  private readonly moduleConfiguration: ModuleService;
  private readonly logger: Logger = new Logger(Bot);

  public readonly events: Collection<keyof ClientEvents, EventListeners> = new Collection<keyof ClientEvents, EventListeners>();

  constructor(
    appConfig: ProjectConfiguration,
    databaseService: DatabaseService,
    moduleConfiguration: ModuleService,
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
    this.databaseService = databaseService;
    this.moduleConfiguration = moduleConfiguration;
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
