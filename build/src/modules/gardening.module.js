var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import { ModuleBase } from "../classes/moduleBase.js";
import { Reason } from "../models/gardeningConfig.model.js";
import { GardeningManagerService } from "../services/gardeningManager.service.js";
let GardeningModule = class GardeningModule extends ModuleBase {
    gardeningManagerService;
    constructor(gardeningManagerService) {
        super();
        this.gardeningManagerService = gardeningManagerService;
        this.moduleName = "GardeningModule";
        this.commands = [{
                command: builder => builder
                    .setName("gardening")
                    .setDescription("gardening module.")
                    .addSubcommand(subComBuilder => subComBuilder
                    .setName("reserve")
                    .setDescription("Reserve a slot in a plot to be used by you.")
                    .addIntegerOption(optionBuilder => optionBuilder
                    .setName("plot")
                    .setDescription("The plot number.")
                    .setRequired(true))
                    .addIntegerOption(optionBuilder => optionBuilder
                    .setName("slot")
                    .setDescription("The slot number.")
                    .setRequired(true))
                    .addStringOption(optionBuilder => optionBuilder
                    .setName("plant")
                    .setDescription("The name of the plant you wish to plant.")
                    .setRequired(true))
                    .addIntegerOption(optionBuilder => optionBuilder
                    .setName("duration")
                    .setDescription("For how long do you wish to reserve this spot. In hours.")
                    .setRequired(true))
                    .addStringOption(optionBuilder => optionBuilder
                    .setName("reason")
                    .setDescription("The reason you are reserving this spot.")
                    .setRequired(true)
                    .addChoices(Object.keys(Reason)
                    .map(value => [
                    value.replace(/(\w)(\w*)/g, (_, g1, g2) => g1 + g2.toLowerCase()),
                    value,
                ]))))
                    .addSubcommand(subComBuilder => subComBuilder
                    .setName("cancel")
                    .setDescription("Cancel any reservations you have made to a slot in a plot.")
                    .addIntegerOption(optionBuilder => optionBuilder
                    .setName("plot")
                    .setDescription("The plot number.")
                    .setRequired(true))
                    .addIntegerOption(optionBuilder => optionBuilder
                    .setName("slot")
                    .setDescription("The slot number.")
                    .setRequired(true))
                    .addStringOption(optionBuilder => optionBuilder
                    .setName("plant")
                    .setDescription("The name of the plant you wish to cancel for.")
                    .setRequired(true)))
                    .addSubcommand(subComBuilder => subComBuilder
                    .setName("list")
                    .setDescription("Shows all plots and their states.")
                    .addIntegerOption(optionBuilder => optionBuilder
                    .setName("plot")
                    .setDescription("Index of the plot you wish to view."))
                    .addIntegerOption(optionBuilder => optionBuilder
                    .setName("slot")
                    .setDescription("Index of the slot you wish to view."))
                    .addBooleanOption(optionBuilder => optionBuilder
                    .setName("detailed")
                    .setDescription("Should show a detailed view. Default: false"))),
                run: async (interaction) => this.subCommandResolver(interaction),
            }];
        this.tasks = [
            { name: `${this.moduleName}#TickTask`, timeout: 60000, run: client => this.tick(client) },
        ];
    }
    register(interaction, player, plant, duration, reason, plotNum, slotNum) {
        return this.gardeningManagerService.register(interaction, player, plant, duration, reason, plotNum, slotNum);
    }
    cancel(interaction, player, plant, plotNum, slotNum) {
        return this.gardeningManagerService.cancel(interaction, player, plant, plotNum, slotNum);
    }
    list(interaction, plotNum, slotNum) {
        return this.gardeningManagerService.list(interaction, plotNum, slotNum);
    }
    tick(client) {
        return this.gardeningManagerService.tick(client);
    }
    subCommandResolver(interaction) {
        const subCommand = interaction.options.getSubcommand();
        if (!subCommand)
            throw new Error();
        const plotNum = interaction.options.getInteger("plot");
        const slotNum = interaction.options.getInteger("slot");
        const player = `${interaction.user.username}#${interaction.user.discriminator}`;
        const plant = interaction.options.getString("plant");
        const duration = (interaction.options.getInteger("duration") ?? 0) * 360;
        const reason = (interaction.options.getInteger("reason") ?? Reason.NONE);
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
};
GardeningModule = __decorate([
    injectable(),
    __metadata("design:paramtypes", [GardeningManagerService])
], GardeningModule);
export { GardeningModule };
//# sourceMappingURL=gardening.module.js.map