import { REST, RouteLike, Routes } from "discord.js";
import { ConfigurationService } from "./configurations/configurationService.js";
import { CommandRegistrationConfiguration, CommonConfigurationKeys, ModuleService } from "./configurations/index.js";
import { Commands } from "./objects/index.js";
import { isPromiseRejected } from "./utils/index.js";
import { Logger } from "./utils/logger/logger.js";

const logger = Logger.build( "CommandRegistration" );

/**
 * Unregisters commands from a route.
 * Handles the result if any fails.
 * @param rest The rest api.
 * @param route The route to delete commands for.
 */
async function unregister( rest: REST, route: RouteLike ) {
    const commands = ( await rest.get( route ) ) as { id: string }[];
    const result = await Promise.allSettled( commands.map( command => rest.delete( `${ route }/${ command.id }` ) ) );

    if( Array.isArray( result ) ) {
        for( const r of result ) {
            if( isPromiseRejected( r ) ) {
                logger.error( r.reason );
            }
        }
    }
}

/**
 * Registers commands for a route.
 * @param rest The REST object.
 * @param route The route.
 * @param commands Collection of commands to build.
 */
async function register( rest: REST, route: RouteLike, commands: Commands ) {
    const builtCommands = [];
    for( const command of commands ) {
        builtCommands.push( command.build() );
    }

    await rest.put( route, { body: builtCommands } );
}

/**
 * Command that attempted to register the slash command to the bot.
 * @param {string} token The token to be used. Overrides the configuration token.
 * @param {boolean} shouldUnregister Boolean flag to determine if we should unregister the commands.
 * @param {CommandRegistrationConfiguration} args Arguments for command registration. Same as configuration.
 */
export async function manageCommands( token = ConfigurationService.getConfiguration<string>( CommonConfigurationKeys.TOKEN ), shouldUnregister = false, args: CommandRegistrationConfiguration = null ): Promise<void> {
    const slashCommands = ModuleService.getSlashCommands().map( struct => struct.value );
    const contextMenuCommands = ModuleService.getContextMenuCommands().map( struct => struct.value );
    const commands = [ ...slashCommands, ...contextMenuCommands ];
    logger.info( "Welcome again to command registration or un-registration." );

    const commandConfigs: CommandRegistrationConfiguration = ConfigurationService.getConfiguration( CommonConfigurationKeys.COMMAND_REGISTRATION );
    if( args ) {
        commandConfigs.merge( args );
    }

    if( !commandConfigs?.isValid ) {
        throw new Error( "Command configuration was not setup correctly." );
    }

    const rest = new REST( { version: "10" } ).setToken( token );

    const isRegistering = shouldUnregister ? "unregistering" : "registering";
    const isGlobal = commandConfigs.registerForGuild ? `guild ${ commandConfigs.guildId }` : "everyone";

    try {
        const route: RouteLike = commandConfigs.registerForGuild
            ? Routes.applicationGuildCommands( commandConfigs.clientId, commandConfigs.guildId )
            : Routes.applicationCommands( commandConfigs.clientId );

        logger.info( `Beginning command ${ isRegistering } for ${ isGlobal }.` );

        await ( shouldUnregister ? unregister( rest, route ) : register( rest, route, commands ) );
        logger.info( `Finished ${ isRegistering } for ${ isGlobal }.` );
    } catch( error ) {
        logger.error( error instanceof Error ? error.stack : error );
    }
}
