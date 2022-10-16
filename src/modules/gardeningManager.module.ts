import { CommandInteraction, ChatInputCommandInteraction, InteractionResponse, ApplicationCommandOptionType } from "discord.js";

import { addCommandKeys } from "../utils/decorators/addCommandKeys.js";
import { authorize } from "../utils/decorators/authorize.js";
import { Client } from "../utils/models/client.js";
import { ModuleBase, Task } from "../utils/models/index.js";
import { GardeningManagerService } from "../services/gardeningManager.service.js";
import { Reason } from "../models/gardening_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilders, CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";

@registerModule()
export class GardeningManagerModule extends ModuleBase {
    @addCommandKeys()
    private static readonly command = {
        $index: "gardening",
        Reserve: "reserve",
        Cancel: "cancel",
        List: "list",
    };

    public moduleName: string = "GardeningModule";
    public commands: CommandBuilders = [
        new CommandBuilder({
            name: "gardening_module",
            description: "gardening module.",
            subcommands: {
                Reverse: {
                    name: "reserve",
                    description: "Reserve a slot in a plot to be used by you.",
                    options: [
                        new CommandBuilderOption({
                            name: "plot",
                            description: "The plot number.",
                            required: true,
                            type: ApplicationCommandOptionType.Integer,
                        }),
                        new CommandBuilderOption({
                            name: "slot",
                            description: "The slot number.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }),
                        new CommandBuilderOption({
                            name: "plant",
                            description: "The name of the plant you wish to plant.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        }),
                        new CommandBuilderOption({
                            name: "duration",
                            description: "For how long do you wish to reserve this spot. In hours.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        }),
                        new CommandBuilderOption({
                            name: "reason",
                            description: "The reason you are reserving this spot.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: Object.keys(Reason).map(value => ({
                                name: value.replace(
                                    /(\w)(\w*)/g,
                                    (_, g1, g2) => g1 + g2.toLowerCase(),
                                ),
                                value: value,
                            })),
                        }),
                    ]
                },
                Cancel: {
                    name: "cancel",
                    description: "Cancel any reservations you have made to a slot in a plot.",
                    options: [
                        new CommandBuilderOption({
                            name: "plot",
                            description: "The plot number.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }),
                        new CommandBuilderOption({
                            name: "slot",
                            description: "The slot number.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }),
                        new CommandBuilderOption({
                            name: "plant",
                            description: "The name of the plant you wish to cancel for.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        })
                    ],
                },
                List: {
                    name: "list",
                    description: "Shows all plots and their states.",
                    options: [
                        new CommandBuilderOption({
                            name: "plot",
                            description: "Index of the plot you wish to view.",
                            type: ApplicationCommandOptionType.Integer,
                        }),
                        new CommandBuilderOption({
                            name: "slot",
                            description: "Index of the slot you wish to view.",
                            type: ApplicationCommandOptionType.Integer,
                        }),
                        new CommandBuilderOption({
                            name: "detailed",
                            description: "Should show a detailed view. Default: false",
                            type: ApplicationCommandOptionType.Boolean,
                        }),
                    ]
                },
            },
            execute: async interaction => this.subCommandResolver(interaction as ChatInputCommandInteraction),
        }) ];

    public tasks: Task[] = [
        { name: `${this.moduleName}#TickTask`, timeout: 60000, run: client => this.tick(client) },
    ];

    constructor(
        private gardeningManagerService: GardeningManagerService,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService);
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