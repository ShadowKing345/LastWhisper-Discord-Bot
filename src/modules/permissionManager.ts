import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, InteractionResponse, } from "discord.js";
import { Module } from "./module.js";
import { Permission, PermissionMode } from "../entities/permissionManager/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { addPermissionKeys, authorize, deferReply, module, SubCommand } from "../decorators/index.js";
import { CommandOption } from "../objects/index.js";
import { Logger } from "../utils/logger/logger.js";

/**
 * Internal method used to help with creating options.
 * @param {boolean} boolOverride
 * @return {CommandOption}
 * @private
 */
function commandKeyHelperBuilder( boolOverride = true ): CommandOption {
    return new CommandOption( {
        name: "key",
        description: "Command permission Key.",
        required: boolOverride,
        type: ApplicationCommandOptionType.String,
    } );
}

/**
 * Module to manager the permissions of commands from a Discord client.
 * @see PermissionManagerService
 */
@module( {
    moduleName: "PermissionManager",
    baseCommand: {
        name: "permissions",
        description: "Controls the permission for each command.",
    }
} )
export class PermissionManagerModule extends Module {
    protected static readonly logger: Logger = new Logger( "PermissionManagerModule" );

    @addPermissionKeys()
    public static permissionKeys = {
        list: "PermissionManager.list",
        addRole: "PermissionManager.addRole",
        removeRole: "PermissionManager.removeRole",
        config: "PermissionManager.config",
        reset: "PermissionManager.reset",
    };

    constructor( private service: PermissionManagerService, ) {
        super( service );
    }

    /**
     * Adds a role to a permission.
     * @param interaction The interaction the command was invoked with.
     */
    @SubCommand( {
        name: "add_role",
        description: "Adds a role to a permission setting.",
        options: [
            commandKeyHelperBuilder( true ),
            new CommandOption( {
                name: "role",
                description: "Role to be added.",
                required: true,
                type: ApplicationCommandOptionType.Role,
            } ),
        ],
    } )
    @authorize( PermissionManagerModule.permissionKeys.addRole )
    @deferReply( true )
    public async addRole( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        PermissionManagerModule.logger.debug( `Add role command invoked for guild ${ interaction.guildId }.` );

        const key = interaction.options.getString( "key", true );
        const role = interaction.options.getRole( "role", true );

        const permission = ( await this.service.getPermission( interaction.guildId, key ) ) ?? new Permission();

        if( permission.roles.includes( role.id ) ) {
            await interaction.editReply( { content: `Role is already there. Will not add again.` } );
        }

        permission.roles.push( role.id );
        await this.service.setPermission( interaction.guildId, key, permission );

        PermissionManagerModule.logger.debug( "Role added successfully." );

        await interaction.editReply( { content: `Role added to key ${ key }` } );
    }

    /**
     * Removes a role from a permission.
     * @param interaction The interaction the command was invoked with.
     */
    @SubCommand( {
        name: "remove_role",
        description: "Removes a role to a permission setting.",
        options: [
            commandKeyHelperBuilder( true ),
            new CommandOption( {
                name: "role",
                description: "Role to be added.",
                required: true,
                type: ApplicationCommandOptionType.Role,
            } ),
        ],
    } )
    @authorize( PermissionManagerModule.permissionKeys.removeRole )
    @deferReply( true )
    public async removeRole( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        PermissionManagerModule.logger.debug( `Remove role command invoked for guild ${ interaction.guildId }.` );

        const key = interaction.options.getString( "key", true );
        const role = interaction.options.getRole( "role", true );

        const permission = ( await this.service.getPermission( interaction.guildId, key ) ) ?? new Permission();

        const index = permission.roles.findIndex( r => r === role.id );
        if( index < 0 ) {
            await interaction.editReply( { content: `Cannot find role ${ role.name } in the permission list ${ key }` } );
        }

        permission.roles.splice( index, 1 );
        await this.service.setPermission( interaction.guildId, key, permission );

        PermissionManagerModule.logger.debug( "Role removed successfully." );

        await interaction.editReply( { content: `Role removed for key ${ key }` } );
    }

    /**
     * Configures a permission.
     * @param interaction The interaction the command was invoked with.
     */
    @SubCommand( {
        name: "set_config",
        description: "Configures a permission.",
        options: [
            commandKeyHelperBuilder( true ),
            new CommandOption( {
                name: "mode",
                description: "Sets the search mode for the command. Any: has any. Strict: has all.",
                required: true,
                choices: [
                    { name: "any", value: PermissionMode.ANY },
                    { name: "strict", value: PermissionMode.STRICT },
                ],
                type: ApplicationCommandOptionType.Integer,
            } ),
            new CommandOption( {
                name: "black_list",
                description: "Reverses the final result. I.e. If list is empty, no one can use the command.",
                type: ApplicationCommandOptionType.String,
            } ),
        ],
    } )
    @authorize( PermissionManagerModule.permissionKeys.config )
    @deferReply( true )
    public async config( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        PermissionManagerModule.logger.debug( `Config invoked for guild ${ interaction.guildId }.` );

        const key = interaction.options.getString( "key", true );
        const mode: number = interaction.options.getInteger( "mode" );
        const blackList: boolean = interaction.options.getBoolean( "black_list" );

        const permission = ( await this.service.getPermission( interaction.guildId, key ) ) ?? new Permission();

        permission.merge( { mode, blackList } );
        await this.service.setPermission( interaction.guildId, key, permission );

        PermissionManagerModule.logger.debug( "Permission settings changed and saved." );

        await interaction.editReply( { content: "Configuration set." } );
    }

    /**
     * Resets all permission options and roles set.
     * @param interaction The interaction the command was invoked with.
     */
    @SubCommand( {
        name: "reset",
        description: "Resets a permission to the default parameters.",
        options: [ commandKeyHelperBuilder( true ) ],
    } )
    @authorize( PermissionManagerModule.permissionKeys.reset )
    @deferReply( true )
    public async reset( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        PermissionManagerModule.logger.debug( `Reset invoked for guild ${ interaction.guildId }.` );

        const key = interaction.options.getString( "key", true );
        await this.service.setPermission( interaction.guildId, key, new Permission() );

        PermissionManagerModule.logger.debug( "Permissions were reset." );
        await interaction.editReply( { content: `Permission ${ key } was successfully reset.` } );
    }

    /**
     * List all permissions keys.
     * If key is set then it gives a detailed view of that permission settings.
     * @param interaction The interaction the command was invoked with.
     */
    @SubCommand( {
        name: "list",
        description: "Lists out all permissions.",
        options: [ commandKeyHelperBuilder( false ) ],
    } )
    @authorize( PermissionManagerModule.permissionKeys.list )
    @deferReply( true )
    public async listPermissions( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        PermissionManagerModule.logger.debug( `Permission key list requested by guild ${ interaction.guildId }.` );
        const key = interaction.options.getString( "key" );

        if( key ) {
            PermissionManagerModule.logger.debug( `Detailed request information for key ${ key }.` );

            const permission = ( await this.service.getPermission( interaction.guildId, key ) ) ?? new Permission();
            PermissionManagerModule.logger.debug( "Permissions found returning parsed object." );

            await interaction.editReply( {
                embeds: [
                    new EmbedBuilder( {
                        title: `Settings for Permission ${ key }`,
                        fields: [
                            {
                                name: "Mode",
                                value: `\`\`\`${ permission.modeEnum }\`\`\``,
                            },
                            {
                                name: "Is Blacklist",
                                value: `\`\`\`${ String( permission.blackList ) }\`\`\``,
                            },
                            {
                                name: "Roles",
                                value: `\`\`\`${ await permission.formatRoles( interaction.guild ) }\`\`\``,
                            },
                        ],
                    } ).setColor( "Random" ),
                ],
            } );
        } else {
            PermissionManagerModule.logger.debug( "Key not specified. Returning all available keys." );

            await interaction.editReply( {
                embeds: [
                    new EmbedBuilder( {
                        title: "List of PermissionKeys",
                        description: `\`\`\`\n${ PermissionManagerService.keysFormatted }\n\`\`\``,
                    } ).setColor( "Random" ),
                ],
            } );
        }
    }
}
