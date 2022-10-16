var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GardeningManagerModule_1;
import { CommandInteraction, ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { addCommandKeys } from "../utils/decorators/addCommandKeys.js";
import { authorize } from "../utils/decorators/authorize.js";
import { ModuleBase } from "../utils/models/index.js";
import { GardeningManagerService } from "../services/gardeningManager.service.js";
import { Reason } from "../models/gardening_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";
let GardeningManagerModule = GardeningManagerModule_1 = class GardeningManagerModule extends ModuleBase {
    gardeningManagerService;
    static command = {
        $index: "gardening",
        Reserve: "reserve",
        Cancel: "cancel",
        List: "list",
    };
    moduleName = "GardeningModule";
    commands = [
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
                                name: value.replace(/(\w)(\w*)/g, (_, g1, g2) => g1 + g2.toLowerCase()),
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
            execute: async (interaction) => this.subCommandResolver(interaction),
        })
    ];
    tasks = [
        { name: `${this.moduleName}#TickTask`, timeout: 60000, run: client => this.tick(client) },
    ];
    constructor(gardeningManagerService, permissionManagerService) {
        super(permissionManagerService);
        this.gardeningManagerService = gardeningManagerService;
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
__decorate([
    authorize(GardeningManagerModule_1.command.$index, GardeningManagerModule_1.command.Reserve),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction, String, String, Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], GardeningManagerModule.prototype, "register", null);
__decorate([
    authorize(GardeningManagerModule_1.command.$index, GardeningManagerModule_1.command.Cancel),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], GardeningManagerModule.prototype, "cancel", null);
__decorate([
    authorize(GardeningManagerModule_1.command.$index, GardeningManagerModule_1.command.List),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction, Number, Number]),
    __metadata("design:returntype", void 0)
], GardeningManagerModule.prototype, "list", null);
__decorate([
    addCommandKeys(),
    __metadata("design:type", Object)
], GardeningManagerModule, "command", void 0);
GardeningManagerModule = GardeningManagerModule_1 = __decorate([
    registerModule(),
    __metadata("design:paramtypes", [GardeningManagerService,
        PermissionManagerService])
], GardeningManagerModule);
export { GardeningManagerModule };
//# sourceMappingURL=gardeningManager.module.js.map