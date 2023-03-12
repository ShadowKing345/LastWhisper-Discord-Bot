import { REST, RouteLike, Routes } from "discord.js";
import { ConfigurationService } from "./config/configurationService.js";
import { CommandRegistrationConfiguration, CommonConfigurationKeys, Logger, ModuleService } from "./config/index.js";
import { isPromiseRejected } from "./utils/index.js";
import { SlashCommands } from "./objects/index.js";

const logger = new Logger( "CommandRegistration" );

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
 * @param slashCommands Collection of slash commands to be registered.
 */
async function register( rest: REST, route: RouteLike, slashCommands: SlashCommands ) {
    const commands = [];
    for( const slashCommand of slashCommands ) {
        commands.push( slashCommand.build().toJSON() );
    }

    await rest.put( route, { body: commands } );
}

/**
 * Command that attempted to register the slash command to the bot.
 * @param token The token to be used. Overrides the configuration token.
 * @param args Arguments for command registration. Same as configuration.
 * @param commands A list of commands to be registered.
 */
export async function manageCommands( token = ConfigurationService.getConfiguration<string>( CommonConfigurationKeys.TOKEN ), args: CommandRegistrationConfiguration = null, commands = ModuleService.getSlashCommands().map( struct => struct.value ) ): Promise<void> {
    logger.info( "Welcome again to command registration or un-registration." );

    const commandConfigs: CommandRegistrationConfiguration = ConfigurationService.getConfiguration( CommonConfigurationKeys.COMMAND_REGISTRATION );
    if( args ) {
        commandConfigs.merge( args );
    }

    if( !commandConfigs?.isValid ) {
        throw new Error( "Command configuration was not setup correctly." );
    }

    const rest = new REST( { version: "10" } ).setToken( token );

    const isRegistering = commandConfigs.unregister ? "unregistering" : "registering";
    const isGlobal = commandConfigs.registerForGuild ? `guild ${ commandConfigs.guildId }` : "everyone";

    try {
        const route: RouteLike = commandConfigs.registerForGuild
            ? Routes.applicationGuildCommands( commandConfigs.clientId, commandConfigs.guildId )
            : Routes.applicationCommands( commandConfigs.clientId );

        logger.info( `Beginning command ${ isRegistering } for ${ isGlobal }.` );

        await ( commandConfigs.unregister ? unregister( rest, route ) : register( rest, route, commands ) );
        logger.info( `Finished ${ isRegistering } for ${ isGlobal }.` );
    } catch( error ) {
        logger.error( error instanceof Error ? error.stack : error );
    }
}
