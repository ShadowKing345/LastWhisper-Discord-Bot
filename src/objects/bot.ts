import { Client, GatewayIntentBits } from "discord.js";
import { ConfigurationService } from "../config/configurationService.js";
import { CommonConfigurationKeys, ModuleService } from "../config/index.js";
import { Logger } from "../utils/logger/logger.js";

/**
 * Application class.
 * To simplify dependency injection this class is used and can be easily resolved.
 */
export class Bot extends Client {
    private static readonly LOGGER = Logger.build( "Bot" );

    constructor(
        private appToken: string = ConfigurationService.getConfiguration( CommonConfigurationKeys.TOKEN ),
        private moduleService: ModuleService = new ModuleService(),
    ) {
        super( {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
            ],
        } );
    }

    /**
     * Main function to initialize application.
     */
    public async init(): Promise<void> {
        try {
            await this.moduleService.configureModules( this );

            this.once( "ready", () => Bot.LOGGER.info( "Bot is up and ready to roll!" ) );
            this.on( "error", error => Bot.LOGGER.error( error ) );

            Bot.LOGGER.info( "Done loading. Ready to run." );
        } catch( error ) {
            Bot.LOGGER.error( "An unexpected error has resulted in the application failing to start." );
            Bot.LOGGER.error( error );
        }
    }

    /**
     * Runs the bot.
     */
    public async run(): Promise<string> {
        return this.login( this.appToken );
    }

    /**
     * Stops everything and cleans up.
     */
    public async stop(): Promise<void> {
        Bot.LOGGER.info( "Stopping application." );

        await this.moduleService.cleanup();

        if( this.isReady() ) {
            this.destroy();
        }

        Bot.LOGGER.info( "Done. Have a nice day!" );
    }
}
