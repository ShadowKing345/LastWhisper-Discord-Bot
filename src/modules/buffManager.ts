import { ApplicationCommandOptionType, ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Bot } from "../objects/bot.js";
import { Module } from "./module.js";
import { BuffManagerService, BuffManagerTryGetError, BuffManagerTryGetErrorReasons } from "../services/buffManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { addPermissionKeys, authorize, deferReply, module, SubCommand, Timer } from "../decorators/index.js";
import { CommandOption } from "../objects/index.js";
import { DateTime } from "luxon";
import { Buff, Week } from "../entities/buffManager/index.js";
import { Logger } from "../utils/logger/logger.js";

const moduleName = "BuffManager";

/**
 * Module designed to deal with requests about buffs.
 * @see BuffManagerService
 */
@module( {
    moduleName: moduleName,
    baseCommand: {
        name: "buff_manager",
        description: "Manages all things related to buffs",
    }
} )
export class BuffManagerModule extends Module {
    protected static readonly logger: Logger = new Logger( "BuffManagerModule" );

    @addPermissionKeys()
    public static permissionKeys = {
        buffs: "BuffManager.buffs",
        weeks: "BuffManager.weeks",
    };

    constructor(
        private service: BuffManagerService,
        permissionManagerService: PermissionManagerService,
    ) {
        super( permissionManagerService );
    }

    /**
     * Entry point for the buffs command.
     * Gets the relevant information to be passed to the service from the interaction.
     * @param interaction The interaction from Discord.
     * @private
     */
    @SubCommand( {
        name: "buffs",
        description: "Shows you what buffs are set.",
        options: [
            new CommandOption( {
                name: "tomorrow",
                description: "Set to true if buff is for tomorrow.",
                required: false,
                type: ApplicationCommandOptionType.Boolean,
            } ),
            new CommandOption( {
                name: "date",
                description: "Get the buff for a specific date. Use ISO 8601 format.",
                required: false,
                type: ApplicationCommandOptionType.String,
            } ),
        ],
    } )
    @authorize( BuffManagerModule.permissionKeys.buffs )
    @deferReply()
    public async postBuffCommand( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        const tomorrow = interaction.options.getBoolean( "tomorrow" );
        const dateString = interaction.options.getString( "date" );

        let date: DateTime = DateTime.fromJSDate( interaction.createdAt );

        if( tomorrow ) {
            date = date.plus( { day: 1 } );
        } else if( dateString ) {
            date = DateTime.fromISO( dateString );
        }

        BuffManagerModule.logger.debug( `Command invoked for buffs.\nPosting buff message for the date ${ date.toISO() }.` );
        let buff: Buff;
        try {
            buff = await this.service.getBuffByDate( interaction.guildId, date );
        } catch( error ) {
            if( !( error instanceof BuffManagerTryGetError ) ) {
                throw error;
            }

            switch( error.reason ) {
                case BuffManagerTryGetErrorReasons.UNKNOWN:
                    throw error;
                case BuffManagerTryGetErrorReasons.WEEKS:
                    await interaction.editReply( { content: "Sorry the are no weeks setup in your guild." } );
                    return;
                case BuffManagerTryGetErrorReasons.BUFFS:
                    await interaction.editReply( { content: "Sorry the are no buffs setup in your guild." } );
                    return;
            }
        }

        if( !buff ) {
            BuffManagerModule.logger.debug( `Buff did not exit.` );
            await interaction.editReply( {
                content: `Sorry, The buff for the date ${ date.toISO() } does not exist in the collection of buffs. Kindly contact a manager or administration to resolve this issue.`,
            } );
        }

        await interaction.editReply( { embeds: [ this.service.createBuffEmbed( "The Buff Shall Be:", buff, date ) ] } );
    }

    /**
     * Entry point for the weeks command.
     * Gets the relevant information to be passed to the service from the interaction.
     * @param interaction The interaction from Discord.
     * @private
     */
    @SubCommand( {
        name: "weeks",
        description: "Shows you what buffs for the week, are set to.",
        options: [
            new CommandOption( {
                name: "next_week",
                description: "Set to true if buff is for tomorrow.",
                required: false,
                type: ApplicationCommandOptionType.Boolean,
            } ),
            new CommandOption( {
                name: "date",
                description: "Get the week for a specific date. Use ISO 8601 format.",
                required: false,
                type: ApplicationCommandOptionType.String,
            } ),
        ],
    } )
    @authorize( BuffManagerModule.permissionKeys.weeks )
    @deferReply()
    public async postWeekCommand( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        const nextWeek = interaction.options.getBoolean( "next_week" );
        const dateString = interaction.options.getString( "date" );

        let date: DateTime = DateTime.fromJSDate( interaction.createdAt );

        if( nextWeek ) {
            date = date.plus( { day: 1 } );
        } else if( dateString ) {
            date = DateTime.fromISO( dateString );
        }

        BuffManagerModule.logger.debug( `Command invoked for weeks.\nPosting week message for ${ date.toISO() }.` );

        let week: Week;
        try {
            week = await this.service.getWeekByDate( interaction.guildId, date );
        } catch( error ) {
            if( !( error instanceof BuffManagerTryGetError ) ) {
                throw error;
            }

            switch( error.reason ) {
                case BuffManagerTryGetErrorReasons.UNKNOWN:
                    throw error;
                case BuffManagerTryGetErrorReasons.WEEKS:
                    await interaction.editReply( { content: "Sorry the are no weeks setup in your guild." } );
                    return;
                case BuffManagerTryGetErrorReasons.BUFFS:
                    await interaction.editReply( { content: "Sorry the are no buffs setup in your guild." } );
                    return;
            }
        }

        await interaction.editReply( {
            embeds: [ this.service.createWeekEmbed( "The Buffs For The Week Shall Be:", week, date ) ],
        } );
    }

    @Timer( { name: `BuffManager#dailyMessageTask`, timeout: 60000, } )
    public postDailyMessage( client: Bot ): Promise<void> {
        return this.service.postDailyMessage( client );
    }
}
