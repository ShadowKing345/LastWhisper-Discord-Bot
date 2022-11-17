var GardeningManagerModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { ApplicationCommandOptionType } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { GardeningManagerService } from "../services/gardeningManager.js";
import { Reason } from "../models/gardening_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { registerModule } from "../utils/decorators/index.js";
import { Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
let GardeningManagerModule = GardeningManagerModule_1 = class GardeningManagerModule extends ModuleBase {
    gardeningManagerService;
    moduleName = "GardeningModule";
    commands = [
        new Command({
            name: "gardening_module",
            description: "gardening module.",
            subcommands: {
                Reverse: new Command({
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
                            choices: Object.keys(Reason).map((value) => ({
                                name: value.replace(/(\w)(\w*)/g, (_, g1, g2) => g1 + g2.toLowerCase()),
                                value: value,
                            })),
                        }),
                    ],
                }),
                Cancel: new Command({
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
                List: new Command({
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
            execute: async (interaction) => this.commandResolver(interaction),
        }),
    ];
    timers = [
        {
            name: `${this.moduleName}#TickTask`,
            timeout: 60000,
            execute: (client) => this.tick(client),
        },
    ];
    commandResolverKeys = {
        "gardening_module.reserve": this.reserve.bind(this),
        "gardening_module.list": this.list.bind(this),
        "gardening_module.cancel": this.cancel.bind(this),
    };
    constructor(gardeningManagerService, permissionManagerService, logger) {
        super(permissionManagerService, logger);
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
    async commandResolver(interaction) {
        const f = await super.commandResolver(interaction, false);
        const plotNum = interaction.options.getInteger("plot");
        const slotNum = interaction.options.getInteger("slot");
        const player = `${interaction.user.username}#${interaction.user.discriminator}`;
        const plant = interaction.options.getString("plant");
        const duration = (interaction.options.getInteger("duration") ?? 0) * 360;
        const reason = (interaction.options.getInteger("reason") ?? Reason.NONE);
        if (f instanceof Function) {
            return f(interaction, plotNum, slotNum, player, plant, duration, reason);
        }
        else {
            return f;
        }
    }
};
GardeningManagerModule = GardeningManagerModule_1 = __decorate([
    registerModule(),
    __param(2, createLogger(GardeningManagerModule_1.name)),
    __metadata("design:paramtypes", [GardeningManagerService,
        PermissionManagerService, Object])
], GardeningManagerModule);
export { GardeningManagerModule };
//# sourceMappingURL=gardeningManager.js.map