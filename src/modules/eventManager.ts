import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Client, EmbedBuilder, Events, InteractionResponse, Message, MessageContextMenuCommandInteraction, PartialMessage } from "discord.js";
import { DateTime } from "luxon";
import { Logger } from "../utils/logger/logger.js";
import { addPermissionKeys, authorize, ContextMenuCommand, deferReply, Event, module, SubCommand, Timer } from "../decorators/index.js";
import { EventObject } from "../entities/eventManager/index.js";
import { EventManagerService, EventObjCommandArgs } from "../services/eventManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { WrongChannelError } from "../utils/errors/index.js";
import { Module } from "./module.js";

const moduleName = "EventManager";

/**
 * Module designed to deal with events. (Not Discord event)
 * @see EventManagerService
 */
@module( {
    moduleName: moduleName,
    baseCommand: {
        name: "event_manager",
        description: "Manages all things related to event planning.",
    }
} )
export class EventManagerModule extends Module {
    protected static readonly logger: Logger = new Logger( "EventManagerModule" );

    @addPermissionKeys()
    public static permissionKeys = {
        create: "EventManager.create",
        update: "EventManager.update",
        cancel: "EventManager.cancel",
        test: "EventManager.test",
        list: "EventManager.list",
    };

    constructor(
        private service: EventManagerService,
        permissionManagerService: PermissionManagerService,
    ) {
        super( permissionManagerService );
    }

    // region Commands

    /**
     * Creates an event using the slash commands.
     * @param interaction The Discord interaction.
     * @private
     */
    @SubCommand( {
        name: "create",
        description: "Creates a new event. Note no message will be posted only the data saved.",
        options: [
            {
                name: "text",
                description: "The new message you want to use instead. (Will not update the exiting message)",
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "name",
                description: "Name of event.",
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "description",
                description: "Description of event.",
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "time",
                description: "Time of event.",
                type: ApplicationCommandOptionType.String,
            },
        ],
    } )
    @authorize( EventManagerModule.permissionKeys.create )
    @deferReply( true )
    public async createEventCommand( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        const args: EventObjCommandArgs = {
            name: interaction.options.getString( "name" ),
            description: interaction.options.getString( "description" ),
            dateTime: interaction.options.getString( "time" ),
            text: interaction.options.getString( "text" ),
        };

        const event = await this.service.create( interaction.guildId, interaction.channelId, args );
        await interaction.editReply( { content: event ? "Event was successfully created." : "Event failed to be created." } );
    }

    /**
     * Updates existing events with slash commands.
     * Does not update the original message if it exists.
     * @param interaction The Discord interaction.
     * @private
     */
    @SubCommand( {
        name: "update",
        description: "Updates event information with new one.",
        options: [
            {
                name: "index",
                description: "The index for the event, starting at 0.",
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
            {
                name: "text",
                description: "The new message you want to use instead. (Will not update the exiting message)",
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "name",
                description: "Name of event.",
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "description",
                description: "Description of event.",
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "time",
                description: "Time of event.",
                type: ApplicationCommandOptionType.String,
            },
        ],
    } )
    @authorize( EventManagerModule.permissionKeys.update )
    @deferReply( true )
    public async updateEventCommand( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        const index = interaction.options.getNumber( "index", true );

        const args: EventObjCommandArgs = {
            text: interaction.options.getString( "text" ),
            name: interaction.options.getString( "name" ),
            description: interaction.options.getString( "description" ),
            dateTime: interaction.options.getString( "time" ),
        }

        const event = await this.service.updateByIndex( interaction.guildId, index, args );
        await interaction.editReply( { content: event ? "Event was successfully updated." : "Event failed to be updated." } );
    }

    /**
     * Cancels an event with slash commands.
     * @param interaction The Discord interaction.
     * @private
     */
    @SubCommand( {
        name: "cancel",
        description: "Cancels an event. This is will effectively stop it.",
        options: [
            {
                name: "index",
                description: "The index for the event, starting at 0.",
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
        ],
    } )
    @authorize( EventManagerModule.permissionKeys.cancel )
    @deferReply( true )
    public async cancelEventCommand( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        const index = interaction.options.getNumber( "index", true );

        try {
            await this.service.cancelByIndex( interaction.guildId, index );
            await interaction.editReply( { content: "Event was successfully canceled." } );
        } catch( error ) {
            EventManagerModule.logger.error( error instanceof Error ? error.stack : error );
            await interaction.editReply( { content: "Event failed to be canceled." } );
        }
    }

    /**
     * Tests the string to see if it is a valid event and returns the result.
     * @param interaction The Discord interaction.
     * @private
     */
    @SubCommand( {
        name: "test",
        description:
            "Tests a given string with the event parser. Checking if it's valid and returning event details.",
        options: [
            {
                name: "text",
                description: "The message you wish to check against.",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    } )
    @authorize( EventManagerModule.permissionKeys.test )
    @deferReply()
    public async testEventCommand( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        const args: EventObjCommandArgs = {
            text: interaction.options.getString( "text", true )
        };

        const event = await this.service.parseEventGuildId( interaction.guildId, args );

        await interaction.editReply( {
            embeds: [
                new EmbedBuilder( {
                    title: event.isValid ? "Event is valid." : "Event is not valid.",
                    fields: [
                        { name: "Name", value: event.name ?? "Name cannot be null." },
                        { name: "Description", value: event.description ?? "Description cannot be null." },
                        {
                            name: "Time",
                            value: event.dateTime
                                ? event.dateTime < DateTime.now().toUnixInteger()
                                    ? `<t:${ event.dateTime }:F>`
                                    : "Time is before the present."
                                : "The format for the time was not correct. Use the Hammer time syntax to help.",
                        },
                        {
                            name: "Additional",
                            value: event.additional.map( pair => `[${ pair[0] }]\n${ pair[1] }` ).join( "\n" )
                        },
                    ],
                } ).setColor( event.isValid ? "Green" : "Red" ),
            ],
        } );
    }

    /**
     * Lists all events currently registered or returns the details of just one event if index is provided.
     * @param interaction The Discord interaction.
     * @private
     */
    @SubCommand( {
        name: "list",
        description: "Displays events.",
        options: [
            {
                name: "index",
                description: "The index for the event, starting at 0.",
                type: ApplicationCommandOptionType.Integer,
            },
        ],
    } )
    @authorize( EventManagerModule.permissionKeys.list )
    @deferReply()
    public async listEventCommand( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        const event = await this.service.findByIndex( interaction.guildId, interaction.options.getInteger( "index" ) );

        if( event == null ) {
            await interaction.editReply( {
                embeds: [
                    new EmbedBuilder( {
                        title: "No events were set.",
                        description: "There are currently no active events going on in your guild.",
                    } ),
                ],
            } );
            return;
        }

        const embed: EmbedBuilder =
            event instanceof EventObject
                ? this.service.createEventEmbed( event )
                : new EmbedBuilder( {
                    title: "Upcoming Events",
                    fields: event.map( ( event, index ) => ( {
                        name: `Index ${ index }:`,
                        value: `${ event.name }\n**Begins: <t:${ event.dateTime }:R>**`,
                        inline: false,
                    } ) ),
                } ).setColor( "Random" );

        await interaction.editReply( { embeds: [ embed ] } );
    }

    // endregion

    // region ContextMenu

    @ContextMenuCommand( {
        name: "Create Event from Message",
        description: "Creates an event from a given message.",
        type: ApplicationCommandType.Message
    } )
    @deferReply( true )
    public async createMessageByContextMenu( interaction: MessageContextMenuCommandInteraction ): Promise<void> {
        EventManagerModule.logger.debug( "Context menu fired. Creating new event." );
        
        const args: EventObjCommandArgs = {
            messageId: interaction.targetMessage.id,
            text: interaction.targetMessage.content,
        }

        try {
            const event = await this.service.create( interaction.guildId, interaction.channelId, args );
            await Promise.allSettled( [
                interaction.targetMessage.react( event ? "✅" : "❎" ),
                interaction.editReply( { content: `Event was${ event ? ' ' : ' was not ' }created.` } )
            ] );
        } catch( error: unknown | Error ) {
            if( error instanceof WrongChannelError ) {
                EventManagerModule.logger.debug( "Channel was wrong." );
                await interaction.editReply( { content: "The channel for this message is not valid and so the event will be ignored." } );
            }

            EventManagerModule.logger.error( error instanceof Error ? error.stack : error );
            await interaction.editReply( { content: "An unknown error has occured." } );
        }
    }

    @ContextMenuCommand( {
        name: "Test Message for Event",
        description: "Tests a message to see if it's a valid event.",
        type: ApplicationCommandType.Message
    })
    @deferReply( true )
    public async testEventByContextMenu( interaction: MessageContextMenuCommandInteraction ): Promise<void> {
        const args: EventObjCommandArgs = {
            text: interaction.targetMessage.content
        };

        const event = await this.service.parseEventGuildId( interaction.guildId, args );

        await interaction.editReply( {
            embeds: [
                new EmbedBuilder( {
                    title: event.isValid ? "Event is valid." : "Event is not valid.",
                    fields: [
                        { name: "Name", value: event.name ?? "Name cannot be null." },
                        { name: "Description", value: event.description ?? "Description cannot be null." },
                        {
                            name: "Time",
                            value: event.dateTime
                                ? event.dateTime < DateTime.now().toUnixInteger()
                                    ? `<t:${ event.dateTime }:F>`
                                    : "Time is before the present."
                                : "The format for the time was not correct. Use the Hammer time syntax to help.",
                        },
                        {
                            name: "Additional",
                            value: event.additional.map( pair => `[${ pair[0] }]\n${ pair[1] }` ).join( "\n" )
                        },
                    ],
                } ).setColor( event.isValid ? "Green" : "Red" ),
            ],
        } );
    }

    // endregion

    // region Events

    /**
     * Event fired when a message is created.
     * Will attempt to create an event from the message and react.
     * @param _
     * @param message The message or partial message to be parsed.
     * @private
     */
    @Event( Events.MessageCreate )
    public async createEvent( _, [ message ]: [ Message | PartialMessage ] ): Promise<void> {
        EventManagerModule.logger.debug( "On Message Create fired. Creating new event." );

        if( message.partial ) message = await message.fetch();
        if( message.applicationId ) {
            EventManagerModule.logger.debug( "Author is an application and message is ignored." );
            return;
        }

        const args: EventObjCommandArgs = {
            text: message.content,
            messageId: message.id,
        };

        try {
            const event: EventObject = await this.service.create( message.guildId, message.channelId, args );
            await message.react( event ? "✅" : "❎" );
            EventManagerModule.logger.debug( "New event created." );
        } catch( error ) {
            if( error instanceof WrongChannelError ) {
                EventManagerModule.logger.debug( "Channel was wrong." );
                return;
            }

            EventManagerModule.logger.error( error instanceof Error ? error.stack : error );
            await message.react( "❓" );
        }
    }

    /**
     * Event fired when a message is updated.
     * Will attempt to update an existing event with the new data and fire.
     * @param oldMessage The message or partial old message.
     * @param newMessage The message or partial new message to be parsed.
     * @private
     */
    @Event( Events.MessageUpdate )
    public async updateEvent( oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage ): Promise<void> {
        if( oldMessage.partial ) await oldMessage.fetch();
        if( newMessage.partial ) await newMessage.fetch();
        if( newMessage.author?.id === newMessage.client?.application?.id || newMessage.applicationId ) {
            EventManagerModule.logger.debug( "Author is an application and message is ignored." );
            return;
        }

        if( !( await this.service.eventExists( oldMessage.guildId, oldMessage.id ) ) ) {
            return;
        }

        const args: EventObjCommandArgs = {
            text: newMessage.content,
        };

        try {
            const event = await this.service.update( oldMessage.guildId, oldMessage.id, args );

            const reaction = newMessage.reactions.cache.find( reaction => reaction.me );
            if( reaction ) await reaction.users.remove( oldMessage.client.user?.id );

            await newMessage.react( event ? "✅" : "❎" );
        } catch( error ) {
            EventManagerModule.logger.error( error instanceof Error ? error.stack : error );
            await newMessage.react( "❓" );
        }
    }

    /**
     * Event fired when a message is deleted.
     * Will attempt to cancel an existing event with the new data and fire.
     * @param message
     * @private
     */
    @Event( Events.MessageDelete )
    public async deleteEvent( message: Message | PartialMessage ): Promise<void> {
        if( message.partial ) message = await message.fetch();

        return this.service.cancel( message.guildId, message.id );
    }

    /**
     * On ready event.
     * @param client The Bot client.
     * @private
     */
    @Event( Events.ClientReady )
    public onReady( client: Client ): Promise<void> {
        return this.service.onReady( client );
    }

    // endregion

    // region Loops
    /**
     * Timer loop fired for when an event reminder needs to be called.
     * @param client
     * @private
     */
    @Timer( {
        name: `${ moduleName }#postMessageTask`,
        timeout: 60000,
    } )
    public reminderLoop( client: Client ): Promise<void> {
        return this.service.reminderLoop( client );
    }

    // endregion
}
