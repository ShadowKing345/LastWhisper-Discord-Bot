import { GardeningConfig, Reason, Slot } from "../models/gardeningConfig.model.js";
import { CommandInteraction, EmbedFieldData } from "discord.js";
import { ModuleBase } from "../classes/moduleBase.js";
import { Client } from "../classes/client.js";
export declare class GardeningModule extends ModuleBase {
    private static readonly loggerMeta;
    private service;
    constructor();
    private subCommandResolver;
    private getConfig;
    private static validatePlotAndSlot;
    register(interaction: CommandInteraction, config: GardeningConfig, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number): Promise<void>;
    cancel(interaction: CommandInteraction, config: GardeningConfig, player: string, plant: string, plotNum: number, slotNum: number): Promise<void>;
    private static printPlotInfo;
    private static printSlotInfo;
    list(interaction: CommandInteraction, config: GardeningConfig, plotNum: number, slotNum: number): Promise<void>;
    tick(client: Client): Promise<void>;
    postChannelMessage(client: Client, config: GardeningConfig, messageArgs: MessagePostArgs): Promise<void>;
}
declare class MessagePostArgs {
    title: string;
    description: string;
    memberUrl: string;
    slot?: Slot;
    fields: EmbedFieldData[];
}
export {};
