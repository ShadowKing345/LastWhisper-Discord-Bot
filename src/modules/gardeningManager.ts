import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    InteractionResponse,
} from "discord.js";
import { Bot } from "../objects/bot.js";
import { Module } from "./module.js";
import { GardeningManagerService } from "../services/gardeningManager.js";
import { Reason } from "../entities/gardeningManager/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
// import { module } from "../decorators/index.js";
import { CommandOption, SlashCommand, SlashCommands } from "../objects/index.js";
import { Timers } from "../objects/timer.js";
import { Logger } from "../config/logger.js";

// @module({})
export class GardeningManagerModule extends Module {
    protected static readonly logger: Logger = new Logger( "GardeningManagerModule" );

    public moduleName = "GardeningModule";
    public commands: SlashCommands = [
        new SlashCommand( {
            name: "gardening_module",
            description: "gardening module.",
            subcommands: [
                new SlashCommand( {
                    name: "reserve",
                    description: "Reserve a slot in a plot to be used by you.",
                    options: [
                        new CommandOption( {
                            name: "plot",
                            description: "The plot number.",
                            required: true,
                            type: ApplicationCommandOptionType.Integer,
                        } ),
                        new CommandOption( {
                            name: "slot",
                            description: "The slot number.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        } ),
                        new CommandOption( {
                            name: "plant",
                            description: "The name of the plant you wish to plant.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        } ),
                        new CommandOption( {
                            name: "duration",
                            description: "For how long do you wish to reserve this spot. In hours.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        } ),
                        new CommandOption( {
                            name: "reason",
                            description: "The reason you are reserving this spot.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: Object.keys( Reason ).map( value => ( {
                                name: value.replace( /(\w)(\w*)/g, ( _, g1, g2 ) => ( g1 as string ) + ( g2 as string ).toLowerCase() ),
                                value: value,
                            } ) ),
                        } ),
                    ],
                } ),
                new SlashCommand( {
                    name: "cancel",
                    description: "Cancel any reservations you have made to a slot in a plot.",
                    options: [
                        new CommandOption( {
                            name: "plot",
                            description: "The plot number.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        } ),
                        new CommandOption( {
                            name: "slot",
                            description: "The slot number.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        } ),
                        new CommandOption( {
                            name: "plant",
                            description: "The name of the plant you wish to cancel for.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        } ),
                    ],
                } ),
                new SlashCommand( {
                    name: "list",
                    description: "Shows all plots and their states.",
                    options: [
                        new CommandOption( {
                            name: "plot",
                            description: "Index of the plot you wish to view.",
                            type: ApplicationCommandOptionType.Integer,
                        } ),
                        new CommandOption( {
                            name: "slot",
                            description: "Index of the slot you wish to view.",
                            type: ApplicationCommandOptionType.Integer,
                        } ),
                        new CommandOption( {
                            name: "detailed",
                            description: "Should show a detailed view. Default: false",
                            type: ApplicationCommandOptionType.Boolean,
                        } ),
                    ],
                } ),
            ],
            // callback: async interaction => this.commandResolver( interaction ),
        } ),
    ];

    public timers: Timers = [
        {
            name: `${ this.moduleName }#TickTask`,
            timeout: 60000,
            execute: client => this.tick( client ),
        },
    ];

    protected commandResolverKeys2 = {
        "gardening_module.reserve": this.reserve.bind( this ),
        "gardening_module.list": this.list.bind( this ),
        "gardening_module.cancel": this.cancel.bind( this ),
    };

    constructor(
        private gardeningManagerService: GardeningManagerService,
        permissionManagerService: PermissionManagerService,
    ) {
        super(
            // GardeningManagerModule.logger,
            permissionManagerService,
        );
    }

    private reserve(
        interaction: ChatInputCommandInteraction,
        player: string,
        plant: string,
        duration: number,
        reason: Reason,
        plotNum: number,
        slotNum: number,
    ): Promise<InteractionResponse | void> {
        return this.gardeningManagerService.register( interaction, player, plant, duration, reason, plotNum, slotNum );
    }

    private cancel(
        interaction: ChatInputCommandInteraction,
        player: string,
        plant: string,
        plotNum: number,
        slotNum: number,
    ): Promise<InteractionResponse | void> {
        return this.gardeningManagerService.cancel( interaction, player, plant, plotNum, slotNum );
    }

    private list( interaction: ChatInputCommandInteraction, plotNum: number, slotNum: number ): Promise<InteractionResponse | void> {
        return this.gardeningManagerService.list( interaction, plotNum, slotNum );
    }

    private tick( client: Bot ): Promise<void> {
        return this.gardeningManagerService.tick( client );
    }
}
