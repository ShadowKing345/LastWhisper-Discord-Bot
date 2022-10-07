var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GardeningManagerService_1;
import { MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { singleton } from "tsyringe";
import { createLogger } from "../utils/loggerService.js";
import { GardeningManagerRepository } from "../repositories/gardeningManager.repository.js";
import { GardeningModuleConfig, Reservation, Slot } from "../models/gardening_manager/index.js";
import { InvalidArgumentError } from "../utils/errors/invalidArgumentError.js";
let GardeningManagerService = GardeningManagerService_1 = class GardeningManagerService {
    gardeningConfigRepository;
    logger;
    constructor(gardeningConfigRepository, logger) {
        this.gardeningConfigRepository = gardeningConfigRepository;
        this.logger = logger;
    }
    static async validatePlotAndSlot(interaction, config, plotNum, slotNum, slotShouldExist = true) {
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
        return [plot, slot];
    }
    static printPlotInfo(plot, plotNum, detailed = false, indent = 1) {
        if (!(plot && plotNum != null && detailed != null && indent != null)) {
            throw new InvalidArgumentError("One or more of the provided arguments were invalid.");
        }
        const indentStr = " ".repeat(2 * indent);
        let result = `${" ".repeat(2 * Math.max(indent - 1, 0))}Plot ${plotNum}:\n`;
        if (detailed && plot.slots) {
            for (let i = 0; i < plot.slots.length; i++) {
                result += GardeningManagerService_1.printSlotInfo(plot.slots[i], i, indent + 1);
            }
        }
        result += `${indentStr}Slot Count: ${plot.slots.length}\n`;
        return result;
    }
    static printSlotInfo(slot, slotNum, indent = 1) {
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
        }
        else {
            result += `${indentStr}Empty\n`;
        }
        return result;
    }
    async register(interaction, player, plant, duration, reason, plotNum, slotNum) {
        const config = await this.findOneOrCreate(interaction.guildId);
        if (!(player && plant && duration != null && reason && plotNum != null && slotNum != null)) {
            throw new InvalidArgumentError("One or more of the provided arguments were invalid.");
        }
        const value = await GardeningManagerService_1.validatePlotAndSlot(interaction, config, plotNum, slotNum, false);
        if (!value)
            return;
        const plot = value[0];
        let slot = value[1];
        if (!slot) {
            slot = new Slot(player, plant, duration, reason, DateTime.now().toUnixInteger());
            plot.slots[plotNum] = slot;
        }
        else {
            slot.next.push(new Reservation(player, plant, duration, reason));
        }
        await this.gardeningConfigRepository.save(config);
        await interaction.reply({ content: "Reservation has been created." });
        await this.postChannelMessage(interaction.client, config, {
            title: "Gardening Plot Has Been Reserved!",
            description: `${interaction.member.displayName} has registered the plot **${plot.name}**, slot **${slotNum}** for the plant **${plant}**.`,
            memberUrl: interaction.member.displayAvatarURL(),
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
    async cancel(interaction, player, plant, plotNum, slotNum) {
        const config = await this.findOneOrCreate(interaction.guildId);
        if (!(player && plant && plotNum != null && slotNum != null)) {
            throw new InvalidArgumentError("One or more of the provided arguments were invalid.");
        }
        const value = await GardeningManagerService_1.validatePlotAndSlot(interaction, config, plotNum, slotNum);
        if (!value)
            return;
        const plot = value[0];
        let slot = value[1];
        if (!slot)
            return interaction.reply({
                content: "Sorry but this slot is currently empty.",
                ephemeral: true,
            });
        if (slot.player === player && slot.plant === plant) {
            const nextReserved = slot.next;
            const next = nextReserved.pop();
            slot = next !== undefined ? new Slot(next.player, next.plant, next.duration, next.reason, DateTime.now().toUnixInteger(), nextReserved) : undefined;
            plot.slots[plotNum] = slot;
        }
        else {
            const next = slot.next.find(reservation => reservation.player === player && reservation.plant === plant);
            if (!next)
                return interaction.reply({
                    content: "There is no reservation currently registered to you.",
                    ephemeral: true,
                });
            slot.next = slot.next.filter(res => res !== next);
        }
        await this.gardeningConfigRepository.save(config);
        return interaction.reply("Reservation has been canceled.");
    }
    async list(interaction, plotNum, slotNum) {
        const config = await this.findOneOrCreate(interaction.guildId);
        const showDetailed = interaction.options.getBoolean("detailed") ?? false;
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
            if (plotNum >= config.plots.length)
                return interaction.reply({
                    content: `Sorry but the plot option must be a number from 0 to ${config.plots.length - 1}`,
                    ephemeral: true,
                });
            const plot = config.plots[plotNum];
            text += GardeningManagerService_1.printPlotInfo(plot, plotNum, showDetailed);
            if (slotNum != null && !showDetailed) {
                if (slotNum >= plot.slots.length)
                    return interaction.reply({
                        content: `Sorry but the slot option must be a number from 0 to ${plot.slots.length - 1}`,
                        ephemeral: true,
                    });
                text += GardeningManagerService_1.printSlotInfo(plot.slots[slotNum], slotNum, 1);
            }
        }
        else {
            for (let plotNum = 0; plotNum < config.plots.length; plotNum++) {
                const plot = config.plots[plotNum];
                text += GardeningManagerService_1.printPlotInfo(plot, plotNum, !showDetailed);
                if (showDetailed) {
                    for (let slotNum = 0; slotNum < plot.slots.length; slotNum++) {
                        text += GardeningManagerService_1.printSlotInfo(plot.slots[slotNum], slotNum, 1);
                    }
                }
            }
        }
        text += "```";
        return interaction.reply(text);
    }
    async tick(client) {
        const now = DateTime.now().toUnixInteger();
        const configs = await this.gardeningConfigRepository.getAll();
        const altered = [];
        for (const config of configs) {
            if (!client.guilds.cache.has(config.guildId))
                continue;
            for (const plot of config.plots) {
                for (let index = 0; index < plot.slots.length; index++) {
                    const slot = plot.slots[index];
                    if (!slot)
                        continue;
                    if (slot.started + slot.duration > now)
                        continue;
                    const nextReserved = slot.next;
                    const next = nextReserved.pop();
                    plot.slots[index] = next ? new Slot(next.player, next.plant, next.duration, next.reason, now, nextReserved) : null;
                    altered.push(config);
                }
            }
        }
        for (const config of altered) {
            this.gardeningConfigRepository.save(config).catch(err => this.logger.error(err));
            await this.postChannelMessage(client, config, {});
        }
    }
    async postChannelMessage(client, config, messageArgs) {
        if (!client.guilds.cache.has(config.guildId))
            return;
        const guild = await client.guilds.fetch(config.guildId);
        if (config.messagePostingChannelId && !guild.channels.cache.has(config.messagePostingChannelId))
            return;
        const channel = await guild.channels.fetch(config.messagePostingChannelId);
        const embed = new MessageEmbed({
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
        await channel.send({ embeds: [embed] });
    }
    async findOneOrCreate(id) {
        let result = await this.gardeningConfigRepository.findOne({ guildId: id });
        if (result)
            return result;
        result = new GardeningModuleConfig();
        result.guildId = id;
        return await this.gardeningConfigRepository.save(result);
    }
};
GardeningManagerService = GardeningManagerService_1 = __decorate([
    singleton(),
    __param(1, createLogger(GardeningManagerService_1.name)),
    __metadata("design:paramtypes", [GardeningManagerRepository, Object])
], GardeningManagerService);
export { GardeningManagerService };
export class MessagePostArgs {
    title;
    description;
    memberUrl;
    slot;
    fields;
}
//# sourceMappingURL=gardeningManager.service.js.map