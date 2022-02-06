var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Reason, Reservation, Slot } from "../models/gardeningConfigModel.js";
import dayjs from "dayjs";
import { ModuleBase } from "../classes/moduleBase.js";
import { GardeningConfigService } from "../services/gardeningConfigService.js";
export class GardeningModule extends ModuleBase {
    constructor() {
        super();
        this.service = new GardeningConfigService();
        this._moduleName = "GardeningModule";
        this._commands = [
            {
                command: builder => builder.setName("gardening").setDescription("gardening module.")
                    .addSubcommand(subComBuilder => subComBuilder.setName("reserve").setDescription("Reserve a slot in a plot to be used by you.")
                    .addIntegerOption(optionBuilder => optionBuilder.setName("plot").setDescription("The plot number.").setRequired(true))
                    .addIntegerOption(optionBuilder => optionBuilder.setName("slot").setDescription("The slot number.").setRequired(true))
                    .addStringOption(optionBuilder => optionBuilder.setName("plant").setDescription("The name of the plant you wish to plant.").setRequired(true))
                    .addIntegerOption(optionBuilder => optionBuilder.setName("duration").setDescription("For how long do you wish to reserve this spot. In hours.").setRequired(true))
                    .addIntegerOption(optionBuilder => optionBuilder.setName("reason").setDescription("The reason you are reserving this spot.").setRequired(true)
                    .addChoices(Object.keys(Reason).filter(key => !isNaN(Number(Reason[key]))).map((value, index) => [value.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()), index]))))
                    .addSubcommand(subComBuilder => subComBuilder.setName("cancel").setDescription("Cancel any reservations you have made to a slot in a plot.")
                    .addIntegerOption(optionBuilder => optionBuilder.setName("plot").setDescription("The plot number.").setRequired(true))
                    .addIntegerOption(optionBuilder => optionBuilder.setName("slot").setDescription("The slot number.").setRequired(true))
                    .addStringOption(optionBuilder => optionBuilder.setName("plant").setDescription("The name of the plant you wish to cancel for.").setRequired(true)))
                    .addSubcommand(subComBuilder => subComBuilder.setName("list").setDescription("Shows all plots and their states.")
                    .addIntegerOption(optionBuilder => optionBuilder.setName("plot").setDescription("Index of the plot you wish to view."))
                    .addIntegerOption(optionBuilder => optionBuilder.setName("slot").setDescription("Index of the slot you wish to view."))
                    .addBooleanOption(optionBuilder => optionBuilder.setName("detailed").setDescription("Should show a detailed view. Default: false"))),
                run: (interaction) => __awaiter(this, void 0, void 0, function* () { return this.subCommandResolver(interaction); })
            }
        ];
        this._tasks = [
            { name: `${this.moduleName}#TickTask`, timeout: 60000, run: client => this.tick(client) }
        ];
    }
    subCommandResolver(interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const subCommand = interaction.options.getSubcommand();
            if (!subCommand)
                throw new Error();
            const config = yield this.getConfig(interaction.guildId);
            const plotNum = interaction.options.getInteger("plot");
            const slotNum = interaction.options.getInteger("slot");
            const player = `${interaction.user.username}#${interaction.user.discriminator}`;
            const plant = interaction.options.getString("plant");
            const duration = ((_a = interaction.options.getInteger("duration")) !== null && _a !== void 0 ? _a : 0) * 360;
            const reason = ((_b = interaction.options.getInteger("reason")) !== null && _b !== void 0 ? _b : 0);
            switch (subCommand) {
                case "reserve":
                    return this.register(interaction, config, player, plant, duration, reason, plotNum, slotNum);
                case "cancel":
                    return this.cancel(interaction, config, player, plant, plotNum, slotNum);
                case "list":
                    return this.list(interaction, config, plotNum, slotNum);
                default:
                    return interaction.reply("Yolo");
            }
        });
    }
    getConfig(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.findOneOrCreate(guildId);
        });
    }
    static validatePlotAndSlot(interaction, config, plotNum, slotNum) {
        return __awaiter(this, void 0, void 0, function* () {
            if (config.plots.length <= plotNum)
                return interaction.reply({
                    content: `Sorry but the plot number has to be from 0 to ${config.plots.length - 1}.`,
                    ephemeral: true
                });
            const plot = config.plots[plotNum];
            if (plot.slots.length <= slotNum)
                return interaction.reply({
                    content: `Sorry but the slot number has to be from 0 to ${plot.slots.length}.`,
                    ephemeral: true
                });
            return [plot, plot.slots[slotNum]];
        });
    }
    register(interaction, config, player, plant, duration, reason, plotNum, slotNum) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = yield GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum);
            if (!valid)
                return;
            let [plot, slot] = valid;
            if (!slot) {
                slot = new Slot(player, plant, duration, reason, dayjs().unix());
                plot.slots[plotNum] = slot;
            }
            else {
                slot.next.push(new Reservation(player, plant, duration, reason));
            }
            yield this.service.update(config);
            return interaction.reply({ content: "Reservation has been created." });
        });
    }
    cancel(interaction, config, player, plant, plotNum, slotNum) {
        return __awaiter(this, void 0, void 0, function* () {
            let valid = yield GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum);
            if (!valid)
                return;
            let [plot, slot] = valid;
            if (!slot)
                return interaction.reply({ content: "Sorry but this slot is currently empty.", ephemeral: true });
            if (slot.player === player && slot.plant === plant) {
                let nextReserved = slot.next;
                let next = nextReserved.pop();
                slot = typeof next !== undefined ? new Slot(next.player, next.plant, next.duration, next.reason, dayjs().unix(), nextReserved) : undefined;
                plot.slots[plotNum] = slot;
            }
            else {
                let next = slot.next.find(reservation => reservation.player === player && reservation.plant === plant);
                if (!next)
                    return interaction.reply({
                        content: "There is no reservation currently registered to you.",
                        ephemeral: true
                    });
                slot.next = slot.next.filter(res => res !== next);
            }
            yield this.service.update(config);
            return interaction.reply("Reservation has been canceled.");
        });
    }
    static printPlotInfo(plot, plotNum, detailed = false, indent = 0) {
        return `${'\t'.repeat(indent)}Plot ${plotNum}:\n`
            + (detailed ? `${'\t'.repeat(indent + 1)}Slot Count: ${plot.slots.length}\n` : "");
    }
    static printSlotInfo(slot, slotNum, indent = 0) {
        const indented = '\t'.repeat(indent + 1);
        return slot ? `${'\t'.repeat(indent)}Slot ${slotNum}:\n`
            + `${indented}Player: ${slot.player}\n`
            + `${indented}Plant: ${slot.plant}\n`
            + `${indented}Reason: ${slot.reason}\n`
            + `${indented}Started: ${slot.started}\n`
            + `${indented}Duration: ${slot.duration}\n`
            + `${indented}Next Queue Size: ${slot.next.length}\n`
            : `${'\t'.repeat(indent)}Slot ${slotNum}: Empty\n`;
    }
    list(interaction, config, plotNum, slotNum) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const showDetailed = (_a = interaction.options.getBoolean("detailed")) !== null && _a !== void 0 ? _a : false;
            if (plotNum === null && slotNum !== null)
                return interaction.reply({
                    content: "Sorry you must include a plot number if you are gonna get the details of a slot.",
                    ephemeral: true
                });
            let text = "\`\`\`";
            if (plotNum !== null) {
                if (plotNum >= config.plots.length)
                    return interaction.reply({ content: `Sorry but the plot option must be a number from 0 to ${config.plots.length - 1}` });
                const plot = config.plots[plotNum];
                if (slotNum !== null) {
                    if (slotNum >= plot.slots.length)
                        return interaction.reply({ content: `Sorry but the slot option must be a number from 0 to ${plot.slots.length - 1}` });
                    text += GardeningModule.printPlotInfo(plot, plotNum);
                    text += GardeningModule.printSlotInfo(plot.slots[slotNum], slotNum, 1);
                }
                else {
                    text += GardeningModule.printPlotInfo(plot, plotNum, true);
                }
            }
            else {
                for (let plotNum = 0; plotNum < config.plots.length; plotNum++) {
                    const plot = config.plots[plotNum];
                    text += GardeningModule.printPlotInfo(plot, plotNum, !showDetailed);
                    if (showDetailed) {
                        for (let slotNum = 0; slotNum < plot.slots.length; slotNum++) {
                            text += GardeningModule.printSlotInfo(plot.slots[slotNum], slotNum, 1);
                        }
                    }
                }
            }
            text += "\`\`\`";
            return interaction.reply(text);
        });
    }
    tick(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = dayjs().unix();
            const configs = yield this.service.getAll();
            const altered = [];
            for (let config of configs) {
                if (!client.guilds.cache.has(config.guildId))
                    continue;
                config.plots.forEach(plot => {
                    plot.slots.forEach((slot, index, array) => {
                        if (!slot)
                            return;
                        if (slot.started + slot.duration > now)
                            return;
                        let nextReserved = slot.next;
                        let next = nextReserved.pop();
                        array[index] = next ? new Slot(next.player, next.plant, next.duration, next.reason, now, nextReserved) : null;
                        if (altered.findIndex((item) => item.guildId === config.guildId) === -1) {
                            altered.push(config);
                        }
                    });
                });
            }
            for (let config of altered) {
                this.service.update(config).catch(err => console.error(err));
            }
        });
    }
}
//# sourceMappingURL=gardeningModule.js.map