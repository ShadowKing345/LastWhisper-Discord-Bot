import {GardeningConfig, Plot, Reason, Reservation, Slot} from "../models/gardeningConfig.model.js";
import dayjs from "dayjs";
import {CommandInteraction, EmbedFieldData, GuildMember, MessageEmbed, TextChannel} from "discord.js";
import {ModuleBase} from "../classes/moduleBase.js";
import {Client} from "../classes/client.js";
import {GardeningConfigService} from "../services/gardeningConfig.service.js";
import {logger} from "../utils/logger.js";
import {injectable} from "tsyringe";

@injectable()
export class GardeningModule extends ModuleBase {
    private static readonly loggerMeta = {context: "GardeningModule"};

    public constructor(private service: GardeningConfigService) {
        super();

        this.moduleName = "GardeningModule";
        this.commands = [{
            command: builder => builder
                .setName("gardening")
                .setDescription("gardening module.")
                .addSubcommand(
                    subComBuilder => subComBuilder
                        .setName("reserve")
                        .setDescription("Reserve a slot in a plot to be used by you.")
                        .addIntegerOption(
                            optionBuilder => optionBuilder
                                .setName("plot")
                                .setDescription("The plot number.")
                                .setRequired(true)
                        )
                        .addIntegerOption(
                            optionBuilder => optionBuilder
                                .setName("slot")
                                .setDescription("The slot number.")
                                .setRequired(true)
                        )
                        .addStringOption(
                            optionBuilder => optionBuilder
                                .setName("plant")
                                .setDescription("The name of the plant you wish to plant.")
                                .setRequired(true)
                        )
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("duration")
                                .setDescription("For how long do you wish to reserve this spot. In hours.")
                                .setRequired(true)
                        )
                        .addStringOption(optionBuilder =>
                            optionBuilder
                                .setName("reason")
                                .setDescription("The reason you are reserving this spot.")
                                .setRequired(true)
                                .addChoices(Object.keys(Reason)
                                    .map(value =>
                                        [
                                            value.replace(
                                                /(\w)(\w*)/g,
                                                (_, g1, g2) => g1 + g2.toLowerCase()
                                            ),
                                            value
                                        ]
                                    )
                                )
                        )
                )
                .addSubcommand(subComBuilder =>
                    subComBuilder
                        .setName("cancel")
                        .setDescription("Cancel any reservations you have made to a slot in a plot.")
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("plot")
                                .setDescription("The plot number.")
                                .setRequired(true)
                        )
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("slot")
                                .setDescription("The slot number.")
                                .setRequired(true)
                        )
                        .addStringOption(optionBuilder =>
                            optionBuilder
                                .setName("plant")
                                .setDescription("The name of the plant you wish to cancel for.")
                                .setRequired(true)
                        )
                )
                .addSubcommand(subComBuilder =>
                    subComBuilder
                        .setName("list")
                        .setDescription("Shows all plots and their states.")
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("plot")
                                .setDescription("Index of the plot you wish to view.")
                        )
                        .addIntegerOption(optionBuilder =>
                            optionBuilder
                                .setName("slot")
                                .setDescription("Index of the slot you wish to view.")
                        )
                        .addBooleanOption(optionBuilder =>
                            optionBuilder
                                .setName("detailed")
                                .setDescription("Should show a detailed view. Default: false")
                        )
                ),
            run: async interaction => this.subCommandResolver(interaction)
        }];

        this.tasks = [
            {name: `${this.moduleName}#TickTask`, timeout: 60000, run: client => this.tick(client)}
        ];
    }

    private async subCommandResolver(interaction: CommandInteraction) {
        const subCommand: string = interaction.options.getSubcommand();
        if (!subCommand) throw new Error();

        const config: GardeningConfig = await this.getConfig(interaction.guildId);
        const plotNum = interaction.options.getInteger("plot");
        const slotNum = interaction.options.getInteger("slot");
        const player = `${interaction.user.username}#${interaction.user.discriminator}`;
        const plant: string = interaction.options.getString("plant");
        const duration: number = (interaction.options.getInteger("duration") ?? 0) * 360;
        const reason: Reason = (interaction.options.getInteger("reason") ?? Reason.NONE) as Reason;

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

    private async getConfig(guildId: string): Promise<GardeningConfig> {
        return this.service.findOneOrCreate(guildId);
    }

    private static async validatePlotAndSlot(interaction: CommandInteraction, config: GardeningConfig, plotNum: number, slotNum: number): Promise<void | [Plot, Slot]> {
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

    public async register(interaction: CommandInteraction, config: GardeningConfig, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number): Promise<void> {
        const value: void | [Plot, Slot] = await GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum);
        if (!value) return;
        const plot: Plot = value[0];
        let slot: Slot = value[1];

        if (!slot) {
            slot = new Slot(player, plant, duration, reason, dayjs().unix());
            plot.slots[plotNum] = slot;
        } else {
            slot.next.push(new Reservation(player, plant, duration, reason));
        }

        await this.service.update(config);
        await interaction.reply({content: "Reservation has been created."});
        await this.postChannelMessage(interaction.client as Client, config, {
            title: "Gardening Plot Has Been Reserved!",
            description: `${(interaction.member as GuildMember).displayName} has registered the plot **${plot.name}**, slot **${slotNum}** for the plant **${plant}**.`,
            memberUrl: (interaction.member as GuildMember).displayAvatarURL(),
            slot: plot.slots[plotNum],
            fields: [
                {
                    name: "Plot:",
                    value: plot.name
                },
                {
                    name: "Slot:",
                    value: slotNum.toString()
                },
                {
                    name: "Plant:",
                    value: plant
                },
                {
                    name: "For how long:",
                    value: duration.toString()
                },
                {
                    name: "Reason",
                    value: reason.toString()
                }
            ]
        });
    }

    public async cancel(interaction: CommandInteraction, config: GardeningConfig, player: string, plant: string, plotNum: number, slotNum: number): Promise<void> {
        const value: void | [Plot, Slot] = await GardeningModule.validatePlotAndSlot(interaction, config, plotNum, slotNum);
        if (!value) return;
        const plot: Plot = value[0];
        let slot: Slot = value[1];

        if (!slot) return interaction.reply({content: "Sorry but this slot is currently empty.", ephemeral: true});

        if (slot.player === player && slot.plant === plant) {
            const nextReserved = slot.next;
            const next = nextReserved.pop();

            slot = typeof next !== undefined ? new Slot(next.player, next.plant, next.duration, next.reason, dayjs().unix(), nextReserved) : undefined;
            plot.slots[plotNum] = slot;
        } else {
            const next = slot.next.find(reservation => reservation.player === player && reservation.plant === plant);
            if (!next) return interaction.reply({
                content: "There is no reservation currently registered to you.",
                ephemeral: true
            });
            slot.next = slot.next.filter(res => res !== next);
        }

        await this.service.update(config);
        return interaction.reply("Reservation has been canceled.");
    }

    private static printPlotInfo(plot: Plot, plotNum: number, detailed = false, indent = 0,): string {
        return `${'\t'.repeat(indent)}Plot ${plotNum}:\n`
            + (detailed ? `${'\t'.repeat(indent + 1)}Slot Count: ${plot.slots.length}\n` : "");
    }

    private static printSlotInfo(slot: Slot, slotNum: number, indent = 0): string {
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

    public async list(interaction: CommandInteraction, config: GardeningConfig, plotNum: number, slotNum: number) {
        const showDetailed: boolean = interaction.options.getBoolean("detailed") ?? false;

        if (plotNum === null && slotNum !== null) return interaction.reply({
            content: "Sorry you must include a plot number if you are gonna get the details of a slot.",
            ephemeral: true
        });

        let text = "```";

        if (plotNum !== null) {
            if (plotNum >= config.plots.length) return interaction.reply({content: `Sorry but the plot option must be a number from 0 to ${config.plots.length - 1}`});
            const plot = config.plots[plotNum];
            if (slotNum !== null) {
                if (slotNum >= plot.slots.length) return interaction.reply({content: `Sorry but the slot option must be a number from 0 to ${plot.slots.length - 1}`});
                text += GardeningModule.printPlotInfo(plot, plotNum);
                text += GardeningModule.printSlotInfo(plot.slots[slotNum], slotNum, 1);
            } else {
                text += GardeningModule.printPlotInfo(plot, plotNum, true);
            }
        } else {
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

        text += "```";

        return interaction.reply(text);
    }

    public async tick(client: Client) {
        const now: number = dayjs().unix();
        const configs: GardeningConfig[] = await this.service.getAll();
        const altered = [];

        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId)) continue;

            config.plots.forEach(plot => {
                plot.slots.forEach((slot, index, array) => {
                    if (!slot) return;
                    if (slot.started + slot.duration > now) return;

                    const nextReserved = slot.next;
                    const next = nextReserved.pop();

                    array[index] = next ? new Slot(next.player, next.plant, next.duration, next.reason, now, nextReserved) : null;
                    if (altered.findIndex((item: GardeningConfig) => item.guildId === config.guildId) === -1) {
                        altered.push(config);
                    }
                });
            });
        }

        for (const config of altered) {
            this.service.update(config).catch(err => logger.error(err, GardeningModule.loggerMeta));
        }
    }

    public async postChannelMessage(client: Client, config: GardeningConfig, messageArgs: MessagePostArgs) {
        if (!client.guilds.cache.has(config.guildId)) return;
        const guild = await client.guilds.fetch(config.guildId);

        if (config.messagePostingChannelId && !guild.channels.cache.has(config.messagePostingChannelId)) return;
        const channel = await guild.channels.fetch(config.messagePostingChannelId) as TextChannel;

        const embed: MessageEmbed = new MessageEmbed({
            title: messageArgs.title,
            description: messageArgs.description,
            thumbnail: {
                url: messageArgs.memberUrl
            },
            fields: messageArgs.fields,
            footer: {
                text: dayjs().format("YYYY-MM-DD HH:mm")
            }
        });

        await channel.send({embeds: [embed]});
    }
}

class MessagePostArgs {
    public title: string;
    public description: string;
    public memberUrl: string;
    public slot?: Slot;
    public fields: EmbedFieldData[];
}
