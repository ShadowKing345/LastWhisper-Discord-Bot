import { CommandInteraction, EmbedFieldData, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { injectWithTransform, singleton } from "tsyringe";

import { LoggerFactory, LoggerFactoryTransformer } from "../shared/logger.js";
import { Client } from "../shared/models/client.js";
import { InvalidArgumentError } from "../shared/models/errors.js";
import { GardeningManagerRepository } from "./gardeningManager.repository.js";
import { GardeningConfig, Plot, Reason, Reservation, Slot } from "./models/index.js";

@singleton()
export class GardeningManagerService {
    constructor(
        private gardeningConfigRepository: GardeningManagerRepository,
        @injectWithTransform(LoggerFactory, LoggerFactoryTransformer, GardeningManagerService.name) private logger: pino.Logger,
    ) {
    }

    protected static async validatePlotAndSlot(interaction: CommandInteraction, config: GardeningConfig, plotNum: number, slotNum: number, slotShouldExist = true): Promise<null | [ Plot, Slot ]> {
        if (!(plotNum != null && slotNum != null && slotShouldExist != null)) {
            throw new InvalidArgumentError("One or more of the provided arguments were invalid.");
        }

        if (config.plots.length <= plotNum) {
            await interaction.reply({
                content: `Sorry but the plot number has to be from 0 to ${config.plots.length - 1}.`,
                ephemeral: true,
            });
            return null;
        }
        const plot = config.plots[plotNum];
        const slot = plot.slots.length > 0 ? plot.slots[slotNum] : null;
        if (!slot && slotShouldExist) {
            await interaction.reply({
                content: `Sorry but the slot number has to be from 0 to ${plot.slots.length}.`,
                ephemeral: true,
            });
            return null;
        }

        return [ plot, slot ];
    }

    protected static printPlotInfo(plot: Plot, plotNum: number, detailed = false, indent = 1): string {
        if (!(plot && plotNum != null && detailed != null && indent != null)) {
            throw new InvalidArgumentError("One or more of the provided arguments were invalid.");
        }

        const indentStr = " ".repeat(2 * indent);

        let result = `${" ".repeat(2 * Math.max(indent - 1, 0))}Plot ${plotNum}:\n`;

        if (detailed && plot.slots) {
            for (let i = 0; i < plot.slots.length; i++) {
                result += GardeningManagerService.printSlotInfo(plot.slots[i], i, indent + 1);
            }
        }

        result += `${indentStr}Slot Count: ${plot.slots.length}\n`;

        return result;
    }

    protected static printSlotInfo(slot: Slot, slotNum: number, indent = 1): string {
        if (!(slotNum != null && indent != null)) {
            throw new InvalidArgumentError("One or more of the provided arguments were invalid.");
        }

        const indentStr = " ".repeat(2 * indent);
        let result = `${" ".repeat(2 * Math.max(indent - 1, 0))}Slot ${slotNum}:\n`;
        if (slot) {
            result += `${indentStr}Player: ${slot.player}\n`;
            result += `${indentStr}Plant: ${slot.plant}\n`;
            result += `${indentStr}Reason: ${slot.reason}\n`;
            result += `${indentStr}Started: ${slot.started}\n`;
            result += `${indentStr}Duration: ${slot.duration}\n`;
            result += `${indentStr}Next Queue Size: ${slot.next.length}\n`;
        } else {
            result += `${indentStr}Empty\n`;
        }

        return result;
    }

    public async register(interaction: CommandInteraction, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number): Promise<void> {
        const config: GardeningConfig = await this.findOneOrCreate(interaction.guildId);

        if (!(player && plant && duration != null && reason && plotNum != null && slotNum != null)) {
            throw new InvalidArgumentError("One or more of the provided arguments were invalid.");
        }
        const value: void | [ Plot, Slot ] = await GardeningManagerService.validatePlotAndSlot(interaction, config, plotNum, slotNum, false);
        if (!value) return;
        const plot: Plot = value[0];
        let slot: Slot = value[1];

        if (!slot) {
            slot = new Slot(player, plant, duration, reason, DateTime.now().toUnixInteger());
            plot.slots[plotNum] = slot;
        } else {
            slot.next.push(new Reservation(player, plant, duration, reason));
        }

        await this.gardeningConfigRepository.save(config);
        await interaction.reply({ content: "Reservation has been created." });
        await this.postChannelMessage(interaction.client as Client, config, {
            title: "Gardening Plot Has Been Reserved!",
            description: `${(interaction.member as GuildMember).displayName} has registered the plot **${plot.name}**, slot **${slotNum}** for the plant **${plant}**.`,
            memberUrl: (interaction.member as GuildMember).displayAvatarURL(),
            slot: plot.slots[plotNum],
            fields: [
                {
                    name: "Plot:",
                    value: plot.name,
                },
                {
                    name: "Slot:",
                    value: slotNum.toString(),
                },
                {
                    name: "Plant:",
                    value: plant,
                },
                {
                    name: "For how long:",
                    value: duration.toString(),
                },
                {
                    name: "Reason",
                    value: reason.toString(),
                },
            ],
        });
    }

    public async cancel(interaction: CommandInteraction, player: string, plant: string, plotNum: number, slotNum: number): Promise<void> {
        const config: GardeningConfig = await this.findOneOrCreate(interaction.guildId);

        if (!(player && plant && plotNum != null && slotNum != null)) {
            throw new InvalidArgumentError("One or more of the provided arguments were invalid.");
        }

        const value: void | [ Plot, Slot ] = await GardeningManagerService.validatePlotAndSlot(interaction, config, plotNum, slotNum);
        if (!value) return;
        const plot: Plot = value[0];
        let slot: Slot = value[1];

        if (!slot) return interaction.reply({
            content: "Sorry but this slot is currently empty.",
            ephemeral: true,
        });

        if (slot.player === player && slot.plant === plant) {
            const nextReserved = slot.next;
            const next = nextReserved.pop();

            slot = typeof next !== undefined ? new Slot(next.player, next.plant, next.duration, next.reason, DateTime.now().toUnixInteger(), nextReserved) : undefined;
            plot.slots[plotNum] = slot;
        } else {
            const next = slot.next.find(reservation => reservation.player === player && reservation.plant === plant);
            if (!next) return interaction.reply({
                content: "There is no reservation currently registered to you.",
                ephemeral: true,
            });
            slot.next = slot.next.filter(res => res !== next);
        }

        await this.gardeningConfigRepository.save(config);
        return interaction.reply("Reservation has been canceled.");
    }

    public async list(interaction: CommandInteraction, plotNum: number, slotNum: number) {
        const config: GardeningConfig = await this.findOneOrCreate(interaction.guildId);
        const showDetailed: boolean = interaction.options.getBoolean("detailed") ?? false;

        if (config.plots.length === 0) {
            return interaction.reply({
                content: "No plot and slot information has been set. Kindly contact the management if this is an issue.",
                ephemeral: true,
            });
        }

        if (plotNum == null && slotNum != null) {
            return interaction.reply({
                content: "Sorry you must include a plot number if you are gonna get the details of a slot.",
                ephemeral: true,
            });
        }

        let text = "```\n";

        if (plotNum != null) {
            if (plotNum >= config.plots.length) return interaction.reply({
                content: `Sorry but the plot option must be a number from 0 to ${config.plots.length - 1}`,
                ephemeral: true,
            });

            const plot = config.plots[plotNum];

            text += GardeningManagerService.printPlotInfo(plot, plotNum, showDetailed);

            if (slotNum != null && !showDetailed) {
                if (slotNum >= plot.slots.length) return interaction.reply({
                    content: `Sorry but the slot option must be a number from 0 to ${plot.slots.length - 1}`,
                    ephemeral: true,
                });

                text += GardeningManagerService.printSlotInfo(plot.slots[slotNum], slotNum, 1);
            }

        } else {
            for (let plotNum = 0; plotNum < config.plots.length; plotNum++) {
                const plot = config.plots[plotNum];
                text += GardeningManagerService.printPlotInfo(plot, plotNum, !showDetailed);
                if (showDetailed) {
                    for (let slotNum = 0; slotNum < plot.slots.length; slotNum++) {
                        text += GardeningManagerService.printSlotInfo(plot.slots[slotNum], slotNum, 1);
                    }
                }
            }
        }

        text += "```";
        return interaction.reply(text);
    }

    public async tick(client: Client) {
        const now: number = DateTime.now().toUnixInteger();
        const configs: GardeningConfig[] = await this.gardeningConfigRepository.getAll();
        const altered: GardeningConfig[] = [];

        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId)) continue;

            for (const plot of config.plots) {
                for (let index = 0; index < plot.slots.length; index++) {
                    const slot = plot.slots[index];
                    if (!slot) continue;
                    if (slot.started + slot.duration > now) continue;

                    const nextReserved = slot.next;
                    const next = nextReserved.pop();

                    plot.slots[index] = next ? new Slot(next.player, next.plant, next.duration, next.reason, now, nextReserved) : null;
                    altered.push(config);
                }
            }
        }

        for (const config of altered) {
            this.gardeningConfigRepository.save(config).catch(err => this.logger.error(err));
            await this.postChannelMessage(client, config, {} as unknown as MessagePostArgs);
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
                url: messageArgs.memberUrl,
            },
            fields: messageArgs.fields,
            footer: {
                text: DateTime.now().toFormat("YYYY-MM-DD HH:mm"),
            },
        });

        await channel.send({ embeds: [ embed ] });
    }

    private async findOneOrCreate(id: string): Promise<GardeningConfig> {
        let result = await this.gardeningConfigRepository.findOne({ guildId: id });
        if (result) return result;

        result = new GardeningConfig();
        result.guildId = id;

        return await this.gardeningConfigRepository.save(result);
    }
}

export class MessagePostArgs {
    public title: string;
    public description: string;
    public memberUrl: string;
    public slot?: Slot;
    public fields: EmbedFieldData[];
}
