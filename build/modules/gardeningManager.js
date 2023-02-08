var GardeningManagerModule_1;
import { __decorate, __metadata } from "tslib";
import { ApplicationCommandOptionType, } from "discord.js";
import { Module } from "./module.js";
import { GardeningManagerService } from "../services/gardeningManager.js";
import { Reason } from "../entities/gardeningManager/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { module } from "../decorators/index.js";
import { CommandOption, SlashCommand } from "../objects/index.js";
import { Logger } from "../config/logger.js";
let GardeningManagerModule = GardeningManagerModule_1 = class GardeningManagerModule extends Module {
    gardeningManagerService;
    static logger = new Logger("GardeningManagerModule");
    moduleName = "GardeningModule";
    commands = [
        new SlashCommand({
            name: "gardening_module",
            description: "gardening module.",
            subcommands: {
                Reverse: new SlashCommand({
                    name: "reserve",
                    description: "Reserve a slot in a plot to be used by you.",
                    options: [
                        new CommandOption({
                            name: "plot",
                            description: "The plot number.",
                            required: true,
                            type: ApplicationCommandOptionType.Integer,
                        }),
                        new CommandOption({
                            name: "slot",
                            description: "The slot number.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }),
                        new CommandOption({
                            name: "plant",
                            description: "The name of the plant you wish to plant.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        }),
                        new CommandOption({
                            name: "duration",
                            description: "For how long do you wish to reserve this spot. In hours.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        }),
                        new CommandOption({
                            name: "reason",
                            description: "The reason you are reserving this spot.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: Object.keys(Reason).map(value => ({
                                name: value.replace(/(\w)(\w*)/g, (_, g1, g2) => g1 + g2.toLowerCase()),
                                value: value,
                            })),
                        }),
                    ],
                }),
                Cancel: new SlashCommand({
                    name: "cancel",
                    description: "Cancel any reservations you have made to a slot in a plot.",
                    options: [
                        new CommandOption({
                            name: "plot",
                            description: "The plot number.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }),
                        new CommandOption({
                            name: "slot",
                            description: "The slot number.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }),
                        new CommandOption({
                            name: "plant",
                            description: "The name of the plant you wish to cancel for.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        }),
                    ],
                }),
                List: new SlashCommand({
                    name: "list",
                    description: "Shows all plots and their states.",
                    options: [
                        new CommandOption({
                            name: "plot",
                            description: "Index of the plot you wish to view.",
                            type: ApplicationCommandOptionType.Integer,
                        }),
                        new CommandOption({
                            name: "slot",
                            description: "Index of the slot you wish to view.",
                            type: ApplicationCommandOptionType.Integer,
                        }),
                        new CommandOption({
                            name: "detailed",
                            description: "Should show a detailed view. Default: false",
                            type: ApplicationCommandOptionType.Boolean,
                        }),
                    ],
                }),
            },
            callback: async (interaction) => this.commandResolver(interaction),
        }),
    ];
    timers = [
        {
            name: `${this.moduleName}#TickTask`,
            timeout: 60000,
            execute: client => this.tick(client),
        },
    ];
    commandResolverKeys2 = {
        "gardening_module.reserve": this.reserve.bind(this),
        "gardening_module.list": this.list.bind(this),
        "gardening_module.cancel": this.cancel.bind(this),
    };
    constructor(gardeningManagerService, permissionManagerService) {
        super(GardeningManagerModule_1.logger, permissionManagerService);
        this.gardeningManagerService = gardeningManagerService;
    }
    reserve(interaction, player, plant, duration, reason, plotNum, slotNum) {
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
};
GardeningManagerModule = GardeningManagerModule_1 = __decorate([
    module(),
    __metadata("design:paramtypes", [GardeningManagerService,
        PermissionManagerService])
], GardeningManagerModule);
export { GardeningManagerModule };
//# sourceMappingURL=gardeningManager.js.map