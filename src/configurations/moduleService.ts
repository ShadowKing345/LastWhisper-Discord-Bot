import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    ClientEvents,
    CommandInteraction,
    ComponentType,
    Interaction
} from "discord.js";
import { clearInterval } from "timers";
import { container } from "tsyringe";
import { Module } from "../modules/module.js";
import { Bot } from "../objects/bot.js";
import { CommandNameDef, ContextMenuCommand, EventListener, SlashCommand, Timer } from "../objects/index.js";
import { CTR } from "../utils/commonTypes.js";
import { CommandResolverError } from "../utils/errors/index.js";
import { isPromiseRejected } from "../utils/index.js";
import { Reflect } from "../utils/reflect.js";
import { CommonConfigurationKeys } from "./configurationKeys.js";
import { ConfigurationService } from "./configurationService.js";
import { DatabaseService } from "./databaseService.js";
import { ModuleConfiguration } from "./classes/index.js";

import { Logger } from "../utils/logger/logger.js";

type CommandStruct<T> = { type: CTR<Module>, value: T }

/**
 * Todo: Separate concerns to the interaction function.
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
export class ModuleService {
    private static readonly moduleServiceLogger = Logger.build( "ModuleService" );
    private static slashCommands: Record<string, CommandStruct<SlashCommand>> = {};
    private static contextMenuCommands: Record<string, CommandStruct<ContextMenuCommand>> = {};
    private static eventListeners: Record<string, CommandStruct<EventListener>[]> = {};
    private static timers: CommandStruct<Timer>[] = [];
    private static readonly timerChildInstance = container.createChildContainer();
    private readonly intervalIds: NodeJS.Timeout[] = [];

    constructor(
        private readonly moduleConfiguration: ModuleConfiguration = ConfigurationService.getConfiguration<ModuleConfiguration>( CommonConfigurationKeys.MODULE ),
    ) {
    }

    /**
     * Abstraction of the set up part for the configuration method.
     * Sets up event listeners for Discord events.
     * @param {Bot} client The client to create the listeners with.
     * @param {Record<string, CommandStruct<EventListener>[]>} events All the events to listen to as well as their listeners.
     * @private
     */
    private setupEvents( client: Bot, events: Record<string, CommandStruct<EventListener>[]> ) {
        for( const [ eventName, listeners ] of Object.entries( events ) ) {
            const filteredListeners = listeners.filter( listener => {
                if( ModuleService.isModuleBlacklisted( listener.type, this.moduleConfiguration.modules, this.moduleConfiguration.blacklist ) ) {
                    ModuleService.moduleServiceLogger.debug( `Module ${ Reflect.getModuleName( listener.type ) } was blacklisted. Skipping event ${ eventName } registration...` );
                    return false;
                }

                return true;
            } );

            client.on( eventName, ( ...args ) => this.runEvent( filteredListeners, client, args ) );
        }
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

        if( interaction.isContextMenuCommand() && this.moduleConfiguration.enableContextMenus ) {
            ModuleService.moduleServiceLogger.debug( `Interaction is a ${ interaction.isUserContextMenuCommand() ? "user" : "message" } context menu.` );

            const { type, value } = ModuleService.contextMenuCommands[interaction.commandName];
            if( !value ) {
                ModuleService.moduleServiceLogger.error( `No context menu command found with name: ${ interaction.commandName }. Exiting` );
                throw new Error( "Hello World" );
            }

            await this.callCallback( type, value.callback, [ interaction ] );
        }

        try {
            if( interaction.isCommand() ) {
                ModuleService.moduleServiceLogger.debug( "Interaction is a command." );

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
            if( ModuleService.isModuleBlacklisted( struct.type, this.moduleConfiguration.modules, this.moduleConfiguration.blacklist ) ) {
                ModuleService.moduleServiceLogger.debug( `Module ${ Reflect.getModuleName( struct.type ) } was blacklisted. Skipping timer set up...` );
                continue;
            }

            ModuleService.moduleServiceLogger.debug( `Setting up timer for module ${ Reflect.getModuleName( struct.type ) }` );
            try {
                const callback = struct.value.execute;
                const thisObj = ModuleService.timerChildInstance.resolve( struct.type );

                if( struct.value.timeout <= 1000 ) {
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

                this.callCallback( struct.type, callback, [ client ] ).then( null, error => ModuleService.moduleServiceLogger.error( error ) );
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
        ModuleService.moduleServiceLogger.info( `Enabled modules are [${ this.moduleConfiguration.modules.join( ',' ) }]` )

        if( this.moduleConfiguration.enableInteractions ) {
            ModuleService.moduleServiceLogger.debug( "Interactions were enabled." );
            client.on( "interactionCreate", this.interactionEvent.bind( this ) );
        }

        if( this.moduleConfiguration.enableTimers ) {
            ModuleService.moduleServiceLogger.debug( "Timers were enabled." );
            await this.runTimers( ModuleService.getTimers(), client );
        }

        if( this.moduleConfiguration.enableEventListeners ) {
            ModuleService.moduleServiceLogger.debug( "Registering event." );
            this.setupEvents( client, ModuleService.getEventListeners() );
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

    /**
     * Checks if a module has been blacklisted.
     * @param {CTR<Module>} module The module to check against.
     * @param {string[]} modules Collection of modules to check against.
     * @param {boolean} blacklist Is this a blacklist or a whitelist.
     * @return {boolean}
     * @private
     */
    private static isModuleBlacklisted( module: CTR<Module>, modules: string[], blacklist: boolean ): boolean {
        return modules.includes( Reflect.getModuleName( module ) ) ? blacklist : !blacklist;
    }

    public static registerSlashCommand( command: SlashCommand, type: CTR<Module> ) {
        ModuleService.slashCommands[command.name] = { value: command, type };
    }

    public static getSlashCommands(): CommandStruct<SlashCommand>[] {
        const objs = Object.values( ModuleService.slashCommands );
        const config = ConfigurationService.getConfiguration<ModuleConfiguration>( CommonConfigurationKeys.MODULE );

        if( !config ) {
            return objs;
        }

        return objs.filter( value => !ModuleService.isModuleBlacklisted( value.type, config.modules, config.blacklist ) );
    }

    public static registerContextMenuCommand( command: ContextMenuCommand, type: CTR<Module> ) {
        ModuleService.contextMenuCommands[command.name] = { value: command, type };
    }

    public static getContextMenuCommands(): CommandStruct<ContextMenuCommand>[] {
        const objs = Object.values( ModuleService.contextMenuCommands );
        const config = ConfigurationService.getConfiguration<ModuleConfiguration>( CommonConfigurationKeys.MODULE );

        if( !config ) {
            return objs;
        }

        return objs.filter( value => !ModuleService.isModuleBlacklisted( value.type, config.modules, config.blacklist ) );
    }

    public static registerEventListener( listener: EventListener, type: CTR<Module> ) {
        const eventName = listener.event as keyof ClientEvents;

        if( !( eventName in ModuleService.eventListeners ) ) {
            ModuleService.eventListeners[eventName] = [];
        }

        ModuleService.eventListeners[eventName].push( { value: listener, type } );
    }

    public static getEventListeners(): Record<string, CommandStruct<EventListener>[]> {
        return ModuleService.eventListeners;
    }

    public static registerTimer( timer: Timer, type: CTR<Module> ) {
        ModuleService.timers.push( { value: timer, type } );
    }

    public static getTimers(): CommandStruct<Timer>[] {
        return ModuleService.timers;
    }

    // endregion
}
