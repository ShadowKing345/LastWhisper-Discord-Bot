"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardeningModule = void 0;
const gardeningConfigModel_1 = require("../models/gardeningConfigModel");
const dayjs_1 = __importDefault(require("dayjs"));
const moduleBase_1 = require("../classes/moduleBase");
const task_1 = require("../classes/task");
const gardeningConfigService_1 = require("../services/gardeningConfigService");
class GardeningModule extends moduleBase_1.ModuleBase {
    constructor() {
        super();
        this.service = new gardeningConfigService_1.GardeningConfigService();
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
                    .addChoices(Object.keys(gardeningConfigModel_1.Reason).filter(key => !isNaN(Number(gardeningConfigModel_1.Reason[key]))).map((value, index) => [value.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()), index]))))
                    .addSubcommand(subComBuilder => subComBuilder.setName("cancel").setDescription("Cancel any reservations you have made to a slot in a plot.")
                    .addIntegerOption(optionBuilder => optionBuilder.setName("plot").setDescription("The plot number.").setRequired(true))
                    .addIntegerOption(optionBuilder => optionBuilder.setName("slot").setDescription("The slot number.").setRequired(true))
                    .addStringOption(optionBuilder => optionBuilder.setName("plant").setDescription("The name of the plant you wish to cancel for.").setRequired(true)))
                    .addSubcommand(subComBuilder => subComBuilder.setName("list").setDescription("Shows all plots and their states.")
                    .addIntegerOption(optionBuilder => optionBuilder.setName("plot").setDescription("Index of the plot you wish to view."))
                    .addIntegerOption(optionBuilder => optionBuilder.setName("slot").setDescription("Index of the slot you wish to view."))
                    .addBooleanOption(optionBuilder => optionBuilder.setName("detailed").setDescription("Should show a detailed view. Default: false"))),
                run: async (interaction) => this.subCommandResolver(interaction)
            }
        ];
        this._tasks = [
            {
                name: "GardeningTickTaskLoop",
                timeout: 60000,
                run: client => task_1.Task.waitTillReady(client).then(() => this.tick(client))
            }
        ];
    }
    async subCommandResolver(interaction) {
        const subCommand = interaction.options.getSubcommand();
        if (!subCommand)
            throw new Error();
        const config = await this.getConfig(interaction.guildId);
        const plotNum = interaction.options.getInteger("plot");
        const slotNum = interaction.options.getInteger("slot");
        const player = `${interaction.user.username}#${interaction.user.discriminator}`;
        const plant = interaction.options.getString("plant");
        const duration = (interaction.options.getInteger("duration") ?? 0) * 360;
        const reason = (interaction.options.getInteger("reason") ?? 0);
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
    }
    async getConfig(guildId) {
        return this.service.findOneOrCreate(guildId);
    }
    static async validatePlotAndSlot(interaction, config, plotNum, slotNum) {
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
    }
    async register(interaction, config, player, plant, duration, reason, plotNum, slotNum) {
        let valid = await GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum);
        if (!valid)
            return;
        let [plot, slot] = valid;
        if (!slot) {
            slot = new gardeningConfigModel_1.Slot(player, plant, duration, reason, (0, dayjs_1.default)().unix());
            plot.slots[plotNum] = slot;
        }
        else {
            slot.next.push(new gardeningConfigModel_1.Reservation(player, plant, duration, reason));
        }
        await this.service.update(config);
        return interaction.reply({ content: "Reservation has been created." });
    }
    async cancel(interaction, config, player, plant, plotNum, slotNum) {
        let valid = await GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum);
        if (!valid)
            return;
        let [plot, slot] = valid;
        if (!slot)
            return interaction.reply({ content: "Sorry but this slot is currently empty.", ephemeral: true });
        if (slot.player === player && slot.plant === plant) {
            let nextReserved = slot.next;
            let next = nextReserved.pop();
            slot = typeof next !== undefined ? new gardeningConfigModel_1.Slot(next.player, next.plant, next.duration, next.reason, (0, dayjs_1.default)().unix(), nextReserved) : undefined;
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
        await this.service.update(config);
        return interaction.reply("Reservation has been canceled.");
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
    async list(interaction, config, plotNum, slotNum) {
        const showDetailed = interaction.options.getBoolean("detailed") ?? false;
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
    }
    async tick(client) {
        const now = (0, dayjs_1.default)().unix();
        const configs = await this.service.getAll();
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
                    array[index] = next ? new gardeningConfigModel_1.Slot(next.player, next.plant, next.duration, next.reason, now, nextReserved) : null;
                    if (altered.findIndex((item) => item.guildId === config.guildId) === -1) {
                        altered.push(config);
                    }
                });
            });
        }
        for (let config of altered) {
            this.service.update(config).catch(err => console.error(err));
        }
    }
}
exports.GardeningModule = GardeningModule;
