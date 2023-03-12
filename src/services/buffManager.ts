import { Channel, ChannelType, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";

import { Bot } from "../objects/bot.js";
import { Timer } from "../objects/timer.js";
import { Buff, Week } from "../entities/buffManager/index.js";
import { Service } from "./service.js";
import { ServiceError } from "../utils/errors/index.js";
import { service } from "../decorators/index.js";
import { WeekRepository } from "../repositories/buffManager/weekRepository.js";
import { BuffManagerSettingsRepository } from "../repositories/buffManager/buffManagerSettingsRepository.js";
import { Logger } from "../config/logger.js";
import { APIEmbedField } from "discord-api-types/v10.js";

/**
 * Buff manager service.
 * This service manages actions related to FF XIV FC buffs.
 * Obviously not within the game as I am very sure that is against TOS.
 */
@service()
export class BuffManagerService extends Service {
    private logger: Logger = new Logger( BuffManagerService );
    private readonly weekRepository: WeekRepository;
    private readonly buffManagerSettingsRepository: BuffManagerSettingsRepository;

    constructor(
        weekRepository: WeekRepository,
        messageSettingsRepository: BuffManagerSettingsRepository,
    ) {
        super();

        // this.buffRepository = buffRepository;
        this.weekRepository = weekRepository;
        this.buffManagerSettingsRepository = messageSettingsRepository;
    }

    /**
     * Returns the Buff by the date.
     * @param guildId Guild ID to ge the configuration from.
     * @param date The date to get the buff from.
     */
    public async getBuffByDate( guildId: string, date: DateTime ): Promise<Buff | null> {
        const week = await this.getWeekByDate( guildId, date );
        return week?.getBuff( date );
    }

    /**
     * Returns the WeekDTO by the date.
     * @see WeekDTO
     * @param guildId Guild ID to ge the configuration from.
     * @param date The date to get the buff from.
     */
    public async getWeekByDate( guildId: string, date: DateTime ): Promise<Week | null> {
        return await this.weekRepository.getWeekOfYear( guildId, date );
    }

    /**
     * Posts a daily message based on the configuration of the guild.
     * @param client The discord client.
     */
    public async postDailyMessage( client: Bot ): Promise<void> {
        await Timer.waitTillReady( client );
        this.logger.debug( "Posting daily buff message." );

        const messageSettings = await this.buffManagerSettingsRepository.getActiveSettings();
        const now: DateTime = DateTime.now();

        for( const settings of messageSettings ) {
            try {
                if( !now.hasSame( DateTime.fromFormat( settings.hour, "HH:mm" ), "minute" ) ) {
                    continue;
                }

                const channel: Channel = await client.channels.fetch( settings.channelId );
                if( !( channel?.type === ChannelType.GuildText && channel.guildId === settings.guildId ) ) {
                    this.logger.warn( `Invalid channel ID for a guild. Skipping...` );
                    continue;
                }

                const week: Week = await this.weekRepository.getWeekOfYear( settings.guildId, now );
                const buff: Buff = week.getBuff( now );

                const embeds: EmbedBuilder[] = [];
                if( !buff ) {
                    this.logger.warn( `Invalid buff ID buffId for guild config.guildId. Skipping...` );
                    continue;
                }

                this.logger.debug( `Posting buff message.` );
                embeds.push( this.createBuffEmbed( settings.buffMessage, buff, now ) );

                if( !isNaN( settings.dow ) && Number( settings.dow ) === now.weekday ) {
                    this.logger.debug( `Posting week message.` );
                    embeds.push( this.createWeekEmbed( settings.weekMessage, week, now ) );
                }

                await channel.send( { embeds } );
            } catch( error ) {
                this.logger.error( error instanceof Error ? error.stack : error );
            }
        }
    }

    /**
     * Creates a Discord embed for a Buff object.
     * @param title The title of the embed.
     * @param buff The buff object.
     * @param date The date context for the buff. Used for footer data, etc.
     */
    public createBuffEmbed( title: string, buff: Buff, date: DateTime ): EmbedBuilder {
        this.logger.debug( `Creating Buff Embed.` );
        return new EmbedBuilder( {
            title: title,
            description: buff.text,
            thumbnail: { url: buff.imageUrl },
            footer: { text: date.toFormat( "DDDD" ) },
        } ).setColor( "Random" );
    }

    /**
     * Creates a Discord embed for a Week object.
     * @see WeekDTO
     * @param title The title of the embed.
     * @param week A WeekDTO object ot be used.
     * @param date The date context for the week. Used to get the week and fill in footer data.
     */
    public createWeekEmbed( title: string, week: Week, date: DateTime ): EmbedBuilder {
        this.logger.debug( `Creating Week Embed.` );

        if( !week ) {
            throw new Error( "Cannot find a valid week." );
        }

        const fields: APIEmbedField[] = [];
        for( const [ day, buff ] of week.days.toArray ) {
            fields.push( {
                name: day,
                value: ( buff )?.text ?? "No buff found.",
                inline: true,
            } );
        }

        return new EmbedBuilder( {
            title: title,
            description: week.title,
            fields: fields,
            footer: { text: `Week ${ date.get( "weekNumber" ) }.` },
        } ).setColor( "Random" );
    }
}

/**
 * Error thrown when the try get method fails error occurs.
 */
export class BuffManagerTryGetError extends ServiceError {
    constructor( message: string, public reason: BuffManagerTryGetErrorReasons ) {
        super( message );
    }
}

export enum BuffManagerTryGetErrorReasons {
    UNKNOWN,
    WEEKS,
    BUFFS,
}
