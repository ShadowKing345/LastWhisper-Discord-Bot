import { ButtonInteraction, ChatInputCommandInteraction, ClientEvents, CommandInteraction, ComponentType, Interaction } from "discord.js";
import { clearInterval } from "timers";
import { container } from "tsyringe";
import { Module } from "../modules/module.js";
import { CommandResolverError } from "../utils/errors/index.js";
import { Bot } from "../objects/bot.js";
import { CommandNameDef, EventListener, SlashCommand, Timer } from "../objects/index.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { ModuleConfiguration } from "./entities/index.js";

import { Logger } from "./logger.js";
import { CTR } from "../utils/commonTypes.js";
import { DatabaseService } from "./databaseService.js";
import { isPromiseRejected } from "../utils/index.js";

type CommandStruct<T> = { type: CTR<Module>, value: T }

/**
 * Todo: Separate concerns to the interaction function.
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
export class ModuleService {
    private static readonly moduleServiceLogger = new Logger( ModuleService.name );
    private static slashCommands: Record<string, CommandStruct<SlashCommand>> = {};
    private static eventListeners: Record<string, CommandStruct<EventListener>[]> = {};
    private static timers: CommandStruct<Timer>[] = [];
    private static readonly timerChildInstance = container.createChildContainer();
    private readonly intervalIds: NodeJS.Timeout[] = [];

    constructor(
        private readonly moduleConfiguration: ModuleConfiguration = ConfigurationService.getConfiguration( CommonConfigurationKeys.MODULE, ModuleConfiguration ),
    ) {
    }

    /**
     * Callback function when a general event other than the interaction event is called.
     * @param listeners A collection of all the listeners to this event.
     * @param client The main application client. Not to be confused with Discord.Js Client.
     * @param args Any additional arguments provided to the event.
     * @private
     */
    private async runEvent( listeners: CommandStruct<EventListener>[], client: Bot, args: unknown[] ): Promise<void> {
        const childContainer = container.createChildContainer();
        const dbService = childContainer.resolve( DatabaseService );
        await dbService.connect();

        const results = await Promise.allSettled(
            listeners.map( struct => {
                const obj = childContainer.resolve( struct.type );
                return struct.value.execute.apply( obj, [ client, args ] );
            } ),
        );

        await dbService.disconnect();

        for( const result of results ) {
            if( isPromiseRejected( result ) ) {
                ModuleService.moduleServiceLogger.error( result.reason );
            }
        }
    }

    /**
     * Todo: Setup modal responding.
     * Todo: Setup buttons/select menu
     * Todo: Context Menu.
     * The main interaction event callback function that is called when a Discord interaction event is called.
     * @param interaction The interaction data object.
     * @private
     */
    private async interactionEvent( interaction: Interaction ): Promise<void> {
        ModuleService.moduleServiceLogger.debug( "Interaction event invoked." );

        try {
            if( interaction.isCommand() ) {
                ModuleService.moduleServiceLogger.debug( "Interaction is a command." );

                if( interaction.isContextMenuCommand() ) {
                    ModuleService.moduleServiceLogger.debug( `Interaction is a ${ interaction.isUserContextMenuCommand() ? "user" : "message" } context menu.`, );

                    if( interaction.isUserContextMenuCommand() ) {
                        await interaction.reply( {
                            content: "Responded with a user",
                            ephemeral: true,
                        } );
                    } else {
                        await interaction.reply( {
                            content: "Responded with a message",
                            ephemeral: true,
                        } );
                    }
                }

                if( interaction.isChatInputCommand() && this.moduleConfiguration.enableCommands ) {
                    ModuleService.moduleServiceLogger.debug( "Interaction is a chat input command. (Slash command.)" );

                    // Edge case if somehow a command can be invoked inside a DM.
                    if( !interaction.guildId ) {
                        ModuleService.moduleServiceLogger.debug( "Warning! Command invoked outside of a guild. Exiting" );
                        return;
                    }

                    const { type, value } = ModuleService.slashCommands[interaction.commandName];
                    if( !value ) {
                        ModuleService.moduleServiceLogger.error( `No command found with name: ${ interaction.commandName }. Exiting` );
                        return;
                    }
                    const command = value;
                    const commandDef = this.getCommandDef( interaction );
                    const callback = command.getCallback( commandDef );

                    if( callback ) {
                        await this.callCallback( type, callback, [ interaction ] );
                    } else {
                        await interaction.reply( { content: "Could not find the command.", ephemeral: true } );
                    }
                }
            } else {
                ModuleService.moduleServiceLogger.debug( "Interaction is not a command." );

                if( interaction.isModalSubmit() ) {
                    await interaction.reply( { content: "Responded", ephemeral: true } );
                }

                if( interaction.isMessageComponent() ) {
                    switch( interaction.componentType ) {
                        case ComponentType.Button:
                            break;
                        case ComponentType.StringSelect:
                            break;
                        default:
                            break;
                    }
                }
            }
        } catch( error ) {
            ModuleService.moduleServiceLogger.error( error );

            if( interaction && ( interaction instanceof ButtonInteraction || interaction instanceof CommandInteraction ) && !interaction.replied ) {
                if( error instanceof CommandResolverError ) {
                    await interaction.reply( {
                        content: "Sorry there was an issue resolving the command name.",
                        ephemeral: true,
                    } );
                    return;
                }

                if( interaction.deferred ) {
                    await interaction.editReply( { content: "There was an internal error that occurred when using this interaction.", } );
                } else {
                    await interaction.reply( {
                        content: "There was an internal error that occurred when using this interaction.",
                        ephemeral: true,
                    } );
                }
            }
        }
    }

    /**
     * Function that sets up a Javascript timer to go off.
     * Also fires the timer as well.
     * @param timerStructs Collection of type timer structs to create intervals for.
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     * @private
     */
    private async runTimers( timerStructs: CommandStruct<Timer>[], client: Bot ): Promise<void> {
        const dbService = ModuleService.timerChildInstance.resolve( DatabaseService );

        for( const struct of timerStructs ) {
            try {
                const callback = struct.value.execute;
                const thisObj = ModuleService.timerChildInstance.resolve( struct.type );

                if( struct.value.timeout < 5000 ) {
                    if( !dbService.isConnected ) {
                        await dbService.connect();
                    }

                    this.intervalIds.push(
                        setInterval( ( callback, thisObj, client ) => {
                            callback.apply( thisObj, [ client ] ).then( null, error => ModuleService.moduleServiceLogger.error( error ) );
                        }, struct.value.timeout, callback, thisObj, client ),
                    );
                } else {
                    this.intervalIds.push(
                        setInterval( ( callback, client ) => {
                            this.callCallback( struct.type, callback, [ client ] )
                                .then( null, error => ModuleService.moduleServiceLogger.error( error ) );
                        }, struct.value.timeout, callback, client ),
                    );
                }

                await this.callCallback( struct.type, callback, [ client ] );

            } catch( error ) {
                ModuleService.moduleServiceLogger.error( error );
            }
        }
    }


    /**
     * Configures a client with all the necessary module and callback information.
     * Registers events, timers, commands, etc...
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     */
    public async configureModules( client: Bot ): Promise<void> {
        ModuleService.moduleServiceLogger.info( "Loading modules." );

        if( this.moduleConfiguration.enableInteractions ) {
            ModuleService.moduleServiceLogger.debug( "Interactions were enabled." );
            client.on( "interactionCreate", this.interactionEvent.bind( this ) );
        }

        if( this.moduleConfiguration.enableTimers ) {
            ModuleService.moduleServiceLogger.debug( "Timers were enabled." );
            await this.runTimers( ModuleService.timers, client );
        }

        if( this.moduleConfiguration.enableEventListeners ) {
            ModuleService.moduleServiceLogger.debug( "Registering event." );
            for( const eventName in ModuleService.eventListeners ) {
                client.on( eventName, ( ...args ) => this.runEvent( ModuleService.eventListeners[eventName], client, args ) );
            }
        }

        ModuleService.moduleServiceLogger.info( "Done." );
    }

    /**
     * Cleanup function.
     */
    public async cleanup() {
        ModuleService.moduleServiceLogger.info( `Cleaning up module configurations.` );
        for( const id of this.intervalIds ) {
            clearInterval( id );
        }

        const dbService = ModuleService.timerChildInstance.resolve( DatabaseService );
        if( dbService.isConnected ) {
            await dbService.disconnect();
        }
    }

    /**
     * Calls a callback with the necessary steps first.
     * @param type The type data for the container to resolve.
     * @param callback The callback to be called using the resolved object.
     * @param args Any additional arguments to be provided to the callback.
     * @private
     */
    private async callCallback( type: CTR<Module>, callback: ( ...args ) => unknown | void, args: unknown[] ): Promise<unknown> {
        const childContainer = container.createChildContainer();

        const dbService = childContainer.resolve( DatabaseService );
        await dbService.connect();
        const obj = childContainer.resolve( type );
        const result = await callback.apply( obj, args );
        await dbService.disconnect();

        return result;
    }

    /**
     * Returns an object that contains all the command name parameters.
     * @param {ChatInputCommandInteraction} interaction The interaction to get the parameters from.
     * @returns {CommandNameDef} An object that contains all the command names.
     * @private
     */
    private getCommandDef( interaction: ChatInputCommandInteraction ): CommandNameDef {
        return {
            name: interaction.commandName,
            group: interaction.options.getSubcommandGroup(),
            sub: interaction.options.getSubcommand()
        };
    }

    // region Static Method

    public static registerSlashCommand( command: SlashCommand, type: CTR<Module> ) {
        ModuleService.slashCommands[command.name] = { value: command, type };
    }

    public static getSlashCommands(): CommandStruct<SlashCommand>[] {
        return Object.values( ModuleService.slashCommands );
    }

    public static registerEventListener( listener: EventListener, type: CTR<Module> ) {
        const eventName = listener.event as keyof ClientEvents;

        if( !( eventName in ModuleService.eventListeners ) ) {
            ModuleService.eventListeners[eventName] = [];
        }

        ModuleService.eventListeners[eventName].push( { value: listener, type } );
    }

    public static getEventListeners(): CommandStruct<EventListener>[] {
        return Object.values( ModuleService.eventListeners ).reduce( ( prev, current ) => {
            prev.push( ...current );
            return prev;
        }, [] );
    }

    public static registerTimer( timer: Timer, type: CTR<Module> ) {
        ModuleService.timers.push( { value: timer, type } );
    }

    public static getTimers(): CommandStruct<Timer>[] {
        return ModuleService.timers;
    }

    // endregion
}
