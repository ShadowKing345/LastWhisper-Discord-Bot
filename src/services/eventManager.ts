import { Channel, ChannelType, Client, EmbedBuilder } from "discord.js";
import { DateTime, Duration } from "luxon";
import { Between, LessThanOrEqual } from "typeorm";
import { Logger } from "../config/logger.js";
import { service } from "../decorators/index.js";
import { EventManagerSettings, EventObject } from "../entities/eventManager/index.js";

import { Timer } from "../objects/timer.js";
import { EventManagerSettingsRepository } from "../repositories/eventManager/eventManagerSettingsRepository.js";
import { EventObjectRepository } from "../repositories/eventManager/eventObjectRepository.js";
import { EventReminderRepository } from "../repositories/eventManager/eventReminderRepository.js";
import { WrongChannelError } from "../utils/errors/index.js";
import { fetchMessages } from "../utils/index.js";
import { Service } from "./service.js";

/**
 * Event manager service.
 * Handles all things related to real life event, not Discord events.
 */
@service()
export class EventManagerService extends Service {
    private logger: Logger = new Logger( EventManagerService );

    private readonly eventManagerSettingsRepository: EventManagerSettingsRepository;
    private readonly eventObjectRepository: EventObjectRepository;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private readonly eventReminderRepository: EventReminderRepository;

    constructor(
        eventManagerSettingsRepository: EventManagerSettingsRepository,
        eventObjectRepository: EventObjectRepository,
        eventReminderRepository: EventReminderRepository,
    ) {
        super();

        this.eventManagerSettingsRepository = eventManagerSettingsRepository;
        this.eventObjectRepository = eventObjectRepository;
        this.eventReminderRepository = eventReminderRepository;
    }

    /**
     * Returns a list of events. Or just one if an index was provided. Null if there are no events.
     * @param guildId Guild ID to get the configuration from.
     * @param index An index number to pick a specific event.
     */
    public async findByIndex( guildId: string | null, index?: number ): Promise<EventObject | EventObject[] | null> {
        const events: EventObject[] = await this.eventObjectRepository.getEventsByGuildId( guildId );

        if( events.length < 1 ) {
            return null;
        }

        return index == null ? events : events[index % events.length];
    }

    /**
     * Attempt to create an event and returns it.
     * Will return null if it was unable to do so.
     * @param {string} guildId Guild ID to get the configuration from.
     * @param channelId
     * @param {EventObjCommandArgs} args Arguments for how to parse the event.
     */
    public async create( guildId: string | null, channelId: string, args: EventObjCommandArgs ): Promise<EventObject | null> {
        const config = await this.eventManagerSettingsRepository.findOneOrCreateByGuildId( guildId );

        if( config.listenerChannelId !== channelId ) {
            throw new WrongChannelError( "Listening channel is not the same as the provided channel ID." );
        }

        const event = this.parseEvent( config, args );
        if( !event.isValid ) {
            return null;
        }

        event.guildId = guildId;
        return this.eventObjectRepository.save( event );
    }

    /**
     * Attempts to information with an event with the new text of the message.
     * @param guildId Guild ID to ge the configuration from.
     * @param messageId ID of the message.
     * @param args Arguments to update a event with a new event.
     */
    public async update( guildId: string | null, messageId: string, args: EventObjCommandArgs ): Promise<EventObject | null> {
        const config = await this.eventManagerSettingsRepository.findOneOrCreateByGuildId( guildId );

        const oldEvent = await this.eventObjectRepository.findOne( { where: { guildId, messageId: messageId } } );
        if( !oldEvent ) {
            throw new Error( "Event does not exist." );
        }

        const event = this.parseEvent( config, args );
        if( !event.isValid ) {
            return null;
        }

        oldEvent.merge( event );
        return this.eventObjectRepository.save( oldEvent );
    }

    /**
     * Attempts to information with an event with the new text of the message by the index rather than the ID.
     * @param guildId Guild ID to ge the configuration from.
     * @param index Index of the event.
     * @param args Arguments to update a event with a new event.
     */
    public async updateByIndex( guildId: string | null, index: number, args: EventObjCommandArgs ): Promise<EventObject> {
        const config = await this.eventManagerSettingsRepository.findOneOrCreateByGuildId( guildId );

        const oldEvent = await this.findByIndex( guildId, index ) as EventObject;

        const event = this.parseEvent( config, args );
        if( !event.isValid ) {
            return null;
        }

        oldEvent.merge( event );
        return this.eventObjectRepository.save( oldEvent );
    }

    /**
     * Attempts to cancel an event if it exists.
     * @param guildId Guild ID to ge the configuration from.
     * @param messageId ID of the event.
     */
    public async cancel( guildId: string | null, messageId: string ): Promise<void> {
        const index = await this.eventObjectRepository.findOne( { where: { guildId, messageId: messageId } } );
        if( !index ) return;

        await this.eventObjectRepository.delete( { id: index.id } );
    }

    /**
     * Attempts to cancel an event if it exists.
     * @param guildId Guild ID to ge the configuration from.
     * @param index Index of the event.
     */
    public async cancelByIndex( guildId: string | null, index: number ): Promise<void> {
        const event = await this.findByIndex( guildId, index ) as EventObject;
        await this.eventObjectRepository.delete( { id: event.id } );
    }

    /**
     * Returns if the event exists or not.
     * @param guildId Guild ID to get the configuration from.
     * @param messageId ID of the event.
     */
    public async eventExists( guildId: string | null, messageId: string ): Promise<boolean> {
        return await this.eventObjectRepository.findOne( { where: { guildId, messageId } } ) != null;
    }

    /**
     * Fetches all event messages to ensure they are loaded for Discord events to fire.
     * @param client The client.
     */
    public async onReady( client: Client ): Promise<void> {
        const promises: Promise<unknown>[] = [];
        const settings: EventManagerSettings[] = await this.eventManagerSettingsRepository.getAll();

        for( const setting of settings ) {
            const events = await this.eventObjectRepository.getEventsByGuildId( setting.guildId );
            if( !setting.listenerChannelId || events.length < 1 ) continue;

            const messageIds: string[] = [];
            for( const event of events ) {
                if( !event.messageId ) {
                    messageIds.push( event.messageId );
                }
            }

            promises.push( fetchMessages( client, setting.listenerChannelId, messageIds ) );
        }

        await Promise.all( promises );
    }

    /**
     * The main loop used to post reminders about events.
     * @param client The client.
     */
    public async reminderLoop( client: Client ): Promise<void> {
        this.logger.debug( "Event timer ticked. Attempting to post messages." )
        await Timer.waitTillReady( client );

        const now: number = DateTime.now().toUnixInteger();

        for( const setting of await this.eventManagerSettingsRepository.getAll() ) {
            try {
                if( !await client.guilds.fetch( { guild: setting.guildId } ) ) {
                    continue;
                }

                const postingChannel: Channel | null = await client.channels.fetch( setting.postingChannelId );

                if( !( postingChannel.type === ChannelType.GuildText && postingChannel.guildId === setting.guildId ) ) {
                    this.logger.warn( "Either posting channel does not exist or it is not inside of guild. Skipping..." );
                    continue;
                }

                const events = await this.eventObjectRepository.getTheDaysEvents( setting.guildId, now );
                const reminders = await this.eventReminderRepository.findAll( {
                    where: events.map( event => {
                        const nowDiff = event.dateTime - now;

                        return ( {
                            guildId: setting.guildId,
                            timeDelta: Between(nowDiff - 30, nowDiff + 30)
                        } );
                    } )
                } );

                for( const reminder of reminders ) {
                    const duration = Duration.fromObject( { seconds: reminder.timeDelta } );
                    for( const event of events ) {
                        const messageValues: { [key: string]: string } = {
                            "%everyone%": "@everyone",
                            "%eventName%": event.name,
                            "%hourDiff%": duration.toFormat( "hh" ),
                            "%minuteDiff%": duration.toFormat( "mm" ),
                        };

                        await postingChannel.send( reminder.message.replace( /%\w+%/g, v => messageValues[v] || v ) );
                    }
                }

                await this.eventObjectRepository.delete( { dateTime: LessThanOrEqual( now ) } );
            } catch( error ) {
                this.logger.error( error instanceof Error ? error.stack : error );
            }
        }
    }

    /**
     * Creates a Discord Embed based on an Event Object.
     * @param {EventObject} event The event object.
     * @return {EmbedBuilder}
     * @private
     */
    public createEventEmbed( event: EventObject ): EmbedBuilder {
        return new EmbedBuilder( {
            title: event.name,
            description: event.description,
            fields: [
                { name: "Time", value: `Set for: <t:${ event.dateTime }:F>\nTime Left: <t:${ event.dateTime }:R>` },
                ...event.additional.map( pair => ( { name: pair[0], value: pair[1], inline: true } ) ),
            ],
        } ).setColor( "Random" );
    }

    /**
     * Parses a collection of arguments into a event object.
     * No event will be created.
     * Uses GuildId
     * @param {string} guildId
     * @param {EventObjCommandArgs} args
     * @returns {Promise<void>}
     */
    public async parseEventGuildId( guildId: string, args: EventObjCommandArgs ): Promise<EventObject> {
        const config = await this.eventManagerSettingsRepository.findOneOrCreateByGuildId( guildId );
        return this.parseEvent( config, args );
    }

    /**
     * Parses a collection of arguments into a event object.
     * No event will be created.
     * @param {EventManagerSettings} config Event manager settings used to create an event object.
     * @param {EventObjCommandArgs} args Arguments for how to parse the event.
     * @return {EventObject}
     */
    public parseEvent( config: EventManagerSettings, args: EventObjCommandArgs ): EventObject {
        let event: EventObject;

        if( args.text ) {
            event = this.parseMessageText( config, args.text );
        } else {
            event = new EventObject( {
                name: args.name,
                description: args.description,
                dateTime: this.parseDateTime( args.dateTime, config.dateTimeFormat ),
                additional: args.additional,
            } );
        }

        return event.merge( { guildId: config.guildId, messageId: args.messageId } );
    }

    /**
     * Attempts to parse a string into a EventObject.
     * @param {EventManagerSettings} config Configuration object with all the settings.
     * @param {string} content The content of the message. As in its text.
     * @return {EventObject}
     * @private
     */
    private parseMessageText(
        config: EventManagerSettings,
        content: string,
    ): EventObject {
        const [ l, r ] = config.delimiterCharacters.map( c => this.regexpEscape( c ) );
        const event: Partial<EventObject> = {};
        const regExp = new RegExp( `${ l }(.*?)${ r }([^${ l }]*)`, "g" );

        for( const [ , k, v ] of content.matchAll( regExp ) ) {
            if( !k || !v ) continue;
            const key = k.trim(),
                value = v.trim();

            switch( key ) {
                case config.announcement:
                    event.name = value;
                    break;

                case config.description:
                    event.description = value;
                    break;

                case config.dateTime:
                    event.dateTime = this.parseDateTime( value, config.dateTimeFormat );
                    break;

                default:
                    if( !config.exclusionList.every( e => e !== key ) ) continue;

                    if( !event.additional ) {
                        event.additional = [];
                    }

                    event.additional.push( [ key, value ] );
                    break;
            }
        }

        return new EventObject( event );
    }

    /**
     * Parses a datetime string into a unix timestamp.
     * @param {string} value Value to parse.
     * @param {string[]} dateTimeFormats List of formats to try parse against.
     * @return {number} A unix timestamp date time.
     * @private
     */
    private parseDateTime( value: string, dateTimeFormats: string[] ): number {
        let date: DateTime;

        for( const format of dateTimeFormats ) {
            date = DateTime.fromFormat( value, format );
            if( date.isValid ) {
                return date.toUnixInteger();
            }
        }

        // Checks if it's hammer time.
        const time = Number( value.match( /<.:(\d+):.>/ )?.[1] ?? undefined );
        if( !time || isNaN( time ) ) {
            return null;
        }

        date = DateTime.fromSeconds( time );
        if( !date.isValid ) {
            return null;
        }

        return date.toUnixInteger();
    }

    /**
     * Returns a string with all regex characters escaped.
     * @param {string} text
     * @return {string}
     * @private
     */
    private regexpEscape( text: string ): string {
        return text.replace( /[-/\\^$*+?.()|[\]{}]/g, "\\$&" );
    }
}

export class EventObjCommandArgs {
    public readonly messageId?: string = null;
    public readonly text?: string;
    public readonly name?: string;
    public readonly description?: string;
    public readonly dateTime?: string;
    public readonly additional?: [ string, string ][];
}