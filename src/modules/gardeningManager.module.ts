import { CommandInteraction, ChatInputCommandInteraction, InteractionResponse } from "discord.js";

import { addCommandKeys } from "../utils/decorators/addCommandKeys.js";
import { authorize } from "../utils/decorators/authorize.js";
import { Client } from "../utils/models/client.js";
import { ModuleBase } from "../utils/models/index.js";
import { GardeningManagerService } from "../services/gardeningManager.service.js";
import { Reason } from "../models/gardening_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";

@registerModule()
export class GardeningManagerModule extends ModuleBase {
    @addCommandKeys()
    private static readonly command = {
        $index: "gardening",
        Reserve: "reserve",
        Cancel: "cancel",
        List: "list",
    };

    constructor(
        private gardeningManagerService: GardeningManagerService,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService);

        this.moduleName = "GardeningModule";
        this.commands = [ {
            command: builder => builder
                .setName(GardeningManagerModule.command.$index)
                .setDescription("gardening module.")
                .addSubcommand(
                    subComBuilder => subComBuilder
                        .setName(GardeningManagerModule.command.Reserve)
                        .setDescription("Reserve a slot in a plot to be used by you.")
                        .addIntegerOption(
                            optionBuilder => optionBuilder
                                .setName("plot")
                                .setDescription("The plot number.")
                                .setRequired(true),
                        )
                        .addIntegerOption(
                            optionBuilder => optionBuilder
                                .setName("slot")
                                .setDescription("The slot number.")
                                .setRequired(true),
                        )
                        .addStringOption(
                            optionBuilder => optionBuilder
                                .setName("plant")
                                .setDescription("The name of the plant you wish to plant.")
                                .setRequired(true),
                        )
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("duration")
                                .setDescription("For how long do you wish to reserve this spot. In hours.")
                                .setRequired(true),
                        )
                        .addStringOption(optionBuilder =>
                            optionBuilder
                                .setName("reason")
                                .setDescription("The reason you are reserving this spot.")
                                .setRequired(true)
                                .addChoices(...Object.keys(Reason)
                                    .map(value => ({
                                            name: value.replace(
                                                /(\w)(\w*)/g,
                                                (_, g1, g2) => g1 + g2.toLowerCase(),
                                            ),
                                            value: value,
                                        }),
                                    ),
                                ),
                        ),
                )
                .addSubcommand(subComBuilder =>
                    subComBuilder
                        .setName(GardeningManagerModule.command.Cancel)
                        .setDescription("Cancel any reservations you have made to a slot in a plot.")
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("plot")
                                .setDescription("The plot number.")
                                .setRequired(true),
                        )
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("slot")
                                .setDescription("The slot number.")
                                .setRequired(true),
                        )
                        .addStringOption(optionBuilder =>
                            optionBuilder
                                .setName("plant")
                                .setDescription("The name of the plant you wish to cancel for.")
                                .setRequired(true),
                        ),
                )
                .addSubcommand(subComBuilder =>
                    subComBuilder
                        .setName(GardeningManagerModule.command.List)
                        .setDescription("Shows all plots and their states.")
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("plot")
                                .setDescription("Index of the plot you wish to view."),
                        )
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("slot")
                                .setDescription("Index of the slot you wish to view."),
                        )
                        .addBooleanOption(optionBuilder =>
                            optionBuilder
                                .setName("detailed")
                                .setDescription("Should show a detailed view. Default: false"),
                        ),
                ),
            execute: async interaction => this.subCommandResolver(interaction as ChatInputCommandInteraction),
        } ];

        this.tasks = [
            { name: `${this.moduleName}#TickTask`, timeout: 60000, run: client => this.tick(client) },
        ];
    }

    @authorize(GardeningManagerModule.command.$index, GardeningManagerModule.command.Reserve)
    private register(interaction: CommandInteraction, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number): Promise<void> {
        return this.gardeningManagerService.register(interaction, player, plant, duration, reason, plotNum, slotNum);
    }

    @authorize(GardeningManagerModule.command.$index, GardeningManagerModule.command.Cancel)
    private cancel(interaction: ChatInputCommandInteraction, player: string, plant: string, plotNum: number, slotNum: number): Promise<InteractionResponse> {
        return this.gardeningManagerService.cancel(interaction, player, plant, plotNum, slotNum);
    }

    @authorize(GardeningManagerModule.command.$index, GardeningManagerModule.command.List)
    private list(interaction: ChatInputCommandInteraction, plotNum: number, slotNum: number) {
        return this.gardeningManagerService.list(interaction, plotNum, slotNum);
    }

    private tick(client: Client): Promise<void> {
        return this.gardeningManagerService.tick(client);
    }

    private subCommandResolver(interaction: ChatInputCommandInteraction) {
        const subCommand: string = interaction.options.getSubcommand();
        if (!subCommand) throw new Error();

        const plotNum = interaction.options.getInteger("plot");
        const slotNum = interaction.options.getInteger("slot");
        const player = `${interaction.user.username}#${interaction.user.discriminator}`;
        const plant: string = interaction.options.getString("plant");
        const duration: number = (interaction.options.getInteger("duration") ?? 0) * 360;
        const reason: Reason = (interaction.options.getInteger("reason") ?? Reason.NONE) as Reason;

        switch (subCommand) {
            case "reserve":
                return this.register(interaction, player, plant, duration, reason, plotNum, slotNum);
            case "cancel":
                return this.cancel(interaction, player, plant, plotNum, slotNum);
            case "list":
                return this.list(interaction, plotNum, slotNum);
            default:
                return interaction.reply({ content: "Not a valid subcommand", ephemeral: true });
        }
    }
}