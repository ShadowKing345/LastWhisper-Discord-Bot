import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandInteraction, ModalActionRowComponentBuilder, ModalBuilder, SelectMenuBuilder, TextInputBuilder, TextInputStyle, } from "discord.js";
import { Logger } from "../config/logger.js";
import { ContextMenuCommand, Event, module, SubCommand, Timer } from "../decorators/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Module } from "./module.js";

/**
 * Development module used for testing features and random things.
 */
@module( {
    moduleName: "DevModule",
    baseCommand: {
        name: "dev",
        description: "Collection of dev commands.",
    }
} )
export class DevModule extends Module {
    private static readonly logger: Logger = new Logger( "DevModule" );
    protected logger: Logger = new Logger( DevModule );


    public constructor(
        permissionManagerService: PermissionManagerService,
    ) {
        super( permissionManagerService );
    }

    @SubCommand( {
        name: "slash_command_subcommand_test",
        description: "Tests if subcommands are working.",
        subcommands: [
            {
                name: "ping",
                description: "Returns pong.",
            },
            {
                name: "pong",
                description: "Returns ping.",
            },
        ],
    } )
    public async subcommandResolverTest( interaction: ChatInputCommandInteraction ): Promise<unknown> {
        switch( interaction.options.getSubcommand() ) {
            case "ping":
                return interaction.reply( "pong" );
            case "pong":
                return interaction.reply( "ping" );
            default:
                return interaction.reply( "what?" );
        }
    }

    @SubCommand( {
        name: "slash_command_test",
        description: "Tests the slash command system. Returns all values placed.",
    } )
    public async testChatInteractionFunction( interaction: ChatInputCommandInteraction ): Promise<unknown> {
        return interaction.reply( { content: "Hello World" } );
    }

    @SubCommand( {
        name: "test_inputs",
        description: "Testing command.",
    } )
    public async testInteractionTypes( interaction: CommandInteraction ): Promise<unknown> {
        const button = new ButtonBuilder().setCustomId( "buttonTest1" ).setLabel( "click me" ).setStyle( ButtonStyle.Danger );

        const select = new SelectMenuBuilder().setCustomId( "selectTest1" ).setPlaceholder( "Nothing selected" ).addOptions(
            {
                label: "Select me",
                description: "This is a description",
                value: "first_option",
            },
            {
                label: "You can select me too",
                description: "This is also a description",
                value: "second_option",
            },
        );

        return interaction.reply( {
            fetchReply: true,
            content: "Testing text",
            components: [
                new ActionRowBuilder<ButtonBuilder>().setComponents( button ),
                new ActionRowBuilder<SelectMenuBuilder>().setComponents( select ),
            ],
        } );
    }

    @SubCommand( {
        name: "test_modal",
        description: "Testing command.",
    } )
    public async testModal( interaction: ChatInputCommandInteraction ): Promise<unknown> {
        const modal = new ModalBuilder().setCustomId( "TestModal1" ).setTitle( "Test Modal" );

        const favoriteColorInput = new TextInputBuilder()
            .setCustomId( "favoriteColorInput" )
            .setLabel( "What's your favorite color?" )
            .setStyle( TextInputStyle.Short );

        const hobbiesInput = new TextInputBuilder()
            .setCustomId( "hobbiesInput" )
            .setLabel( "What's some of your favorite hobbies?" )
            .setStyle( TextInputStyle.Paragraph );

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents( favoriteColorInput );
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents( hobbiesInput );

        modal.addComponents( firstActionRow, secondActionRow );
        return interaction.showModal( modal );
    }

    @Event( "ready" )
    public async onReady(): Promise<void> {
        DevModule.logger.debug( "Hello from the other side." );
        await Promise.resolve();
    }

    @Timer( { name: "DevModule#TimerTest", timeout: 10000 } )
    public async timerTest(): Promise<void> {
        DevModule.logger.debug( "Timer ticked." );
        return Promise.resolve();
    }

    @ContextMenuCommand( {
        name: "DebugMSG",
        description: "Prints message to debug shell.",
        type: ApplicationCommandType.Message
    } )
    public async printMessageInfo( interaction: ContextMenuCommandInteraction ): Promise<void> {
        console.log( interaction );
        await interaction.reply( { content: "True", ephemeral: true } );
    }

    @ContextMenuCommand( {
        name: "DebugUSR",
        description: "Prints the user to debug shell.",
        type: ApplicationCommandType.User
    } )
    public async printUserInfo( interaction: ContextMenuCommandInteraction ): Promise<void> {
        console.log( interaction );
        await interaction.reply( { content: "True", ephemeral: true } );
    }
}