import {Module} from "../classes/Module";
import {Plot, Reason, Reservation, Slot} from "../objects/gardening";
import GardeningConfiguration from "../configurations/gardeningModule";
import Schema from "../schema/gardeningManager";
import dayjs from "dayjs";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import Client from "../classes/Client";
import Task from "../classes/Task";

export default class GardeningModule extends Module {
    public constructor() {
        super("GardeningModule");

        this.commands = [
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
                        .addBooleanOption(optionBuilder => optionBuilder.setName("detailed").setDescription("Should show a detailed view. Default: false"))) as SlashCommandBuilder,
                run: async interaction => GardeningModule.subCommandResolver(interaction)
            }
        ];

        this.tasks = [
            {
                name: "GardeningTickTaskLoop",
                timeout: 60000,
                run: client => Task.waitTillReady(client).then(() => GardeningModule.tick(client))
            }
        ];
    }

    private static async subCommandResolver(interaction: CommandInteraction) {
        const subCommand: string = interaction.options.getSubcommand();
        if (!subCommand) throw new Error();

        const config: GardeningConfiguration = await this.getConfig(interaction.guildId);
        const plotNum = interaction.options.getInteger("plot");
        const slotNum = interaction.options.getInteger("slot");
        const player: string = `${interaction.user.username}#${interaction.user.discriminator}`;
        const plant: string = interaction.options.getString("plant");
        const duration: number = (interaction.options.getInteger("duration") ?? 0) * 360;
        const reason: Reason = (interaction.options.getInteger("reason") ?? 0) as Reason;

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

    private static async getConfig(guildId: string): Promise<GardeningConfiguration> {
        return await Schema.findOne({_id: guildId}) ?? await Schema.create({_id: guildId});
    }

    private static async validatePlotAndSlot(interaction: CommandInteraction, config: GardeningConfiguration, plotNum: number, slotNum: number): Promise<void | [Plot, Slot]> {
        if (config.plots.length <= plotNum) return interaction.reply({
            content: `Sorry but the plot number has to be from 0 to ${config.plots.length - 1}.`,
            ephemeral: true
        });
        const plot = config.plots[plotNum];
        if (plot.slots.length <= slotNum) return interaction.reply({
            content: `Sorry but the slot number has to be from 0 to ${plot.slots.length}.`,
            ephemeral: true
        });
        return [plot, plot.slots[slotNum]];
    }

    public static async register(interaction: CommandInteraction, config: GardeningConfiguration, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number): Promise<void> {
        let valid: void | [Plot, Slot] = await this.validatePlotAndSlot(interaction, config, plotNum, slotNum);
        if (!valid) return;
        let [plot, slot] = valid;

        if (!slot) {
            slot = new Slot(player, plant, duration, reason, dayjs().unix());
            plot.slots[plotNum] = slot;
        } else {
            slot.next.push(new Reservation(player, plant, duration, reason));
        }

        await Schema.findOneAndUpdate({_id: config._id}, config);
        return interaction.reply({content: "Reservation has been created."});
    }

    public static async cancel(interaction: CommandInteraction, config: GardeningConfiguration, player: string, plant: string, plotNum: number, slotNum: number): Promise<void> {
        let valid: void | [Plot, Slot] = await this.validatePlotAndSlot(interaction, config, plotNum, slotNum);
        if (!valid) return;
        let [plot, slot] = valid;

        if (!slot) return interaction.reply({content: "Sorry but this slot is currently empty.", ephemeral: true});

        if (slot.player === player && slot.plant === plant) {
            let nextReserved = slot.next;
            let next = nextReserved.pop();

            slot = typeof next !== undefined ? new Slot(next.player, next.plant, next.duration, next.reason, dayjs().unix(), nextReserved) : undefined;
            plot.slots[plotNum] = slot;
        } else {
            let next = slot.next.find(reservation => reservation.player === player && reservation.plant === plant);
            if (!next) return interaction.reply({
                content: "There is no reservation currently registered to you.",
                ephemeral: true
            });
            slot.next = slot.next.filter(res => res !== next);
        }

        await Schema.findOneAndUpdate({_id: config._id}, config);
        return interaction.reply("Reservation has been canceled.");
    }

    private static printPlotInfo(plot: Plot, plotNum: number, detailed: boolean = false, indent: number = 0,): string {
        return `${'\t'.repeat(indent)}Plot ${plotNum}:\n`
            + (detailed ? `${'\t'.repeat(indent + 1)}Slot Count: ${plot.slots.length}\n` : "");
    }

    private static printSlotInfo(slot: Slot, slotNum: number, indent: number = 0): string {
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

    public static async list(interaction: CommandInteraction, config: GardeningConfiguration, plotNum: number, slotNum: number) {
        const showDetailed: boolean = interaction.options.getBoolean("detailed") ?? false;

        if (plotNum === null && slotNum !== null) return interaction.reply({
            content: "Sorry you must include a plot number if you are gonna get the details of a slot.",
            ephemeral: true
        });

        let text = "\`\`\`";

        if (plotNum !== null) {
            if (plotNum >= config.plots.length) return interaction.reply({content: `Sorry but the plot option must be a number from 0 to ${config.plots.length - 1}`});
            const plot = config.plots[plotNum];
            if (slotNum !== null) {
                if (slotNum >= plot.slots.length) return interaction.reply({content: `Sorry but the slot option must be a number from 0 to ${plot.slots.length - 1}`});
                text += this.printPlotInfo(plot, plotNum);
                text += this.printSlotInfo(plot.slots[slotNum], slotNum, 1);
            } else {
                text += this.printPlotInfo(plot, plotNum, true);
            }
        } else {
            for (let plotNum = 0; plotNum < config.plots.length; plotNum++) {
                const plot = config.plots[plotNum];
                text += this.printPlotInfo(plot, plotNum, !showDetailed);
                if (showDetailed) {
                    for (let slotNum = 0; slotNum < plot.slots.length; slotNum++) {
                        text += this.printSlotInfo(plot.slots[slotNum], slotNum, 1);
                    }
                }
            }
        }

        text += "\`\`\`";

        return interaction.reply(text);
    }

    public static async tick(client: Client) {
        const now: number = dayjs().unix();
        const configs: GardeningConfiguration[] = await Schema.find({}) as GardeningConfiguration[];
        const altered = [];

        for (let config of configs) {
            if (!client.guilds.cache.has(config._id)) continue;

            config.plots.forEach(plot => {
                plot.slots.forEach((slot, index, array) => {
                    if (!slot) return;
                    if (slot.started + slot.duration > now) return;

                    let nextReserved = slot.next;
                    let next = nextReserved.pop();

                    array[index] = next ? new Slot(next.player, next.plant, next.duration, next.reason, now, nextReserved) : null;
                    if (altered.findIndex((item: GardeningConfiguration) => item._id === config._id) === -1) {
                        altered.push(config);
                    }
                });
            });
        }

        for (let config of altered) {
            Schema.updateOne({_id: config._id}, config).catch(err => console.error(err));
        }
    }
};