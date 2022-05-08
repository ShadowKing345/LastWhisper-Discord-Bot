import { CommandInteraction, EmbedFieldData } from "discord.js";
import { Client } from "../classes/client.js";
import { ModuleBase } from "../classes/moduleBase.js";
import { GardeningConfig, Plot, Reason, Slot } from "../models/gardeningConfig.model.js";
import { GardeningConfigService } from "../services/gardeningConfig.service.js";
export declare class GardeningModule extends ModuleBase {
    private service;
    private static readonly loggerMeta;
    constructor(service: GardeningConfigService);
    protected static validatePlotAndSlot(interaction: CommandInteraction, config: GardeningConfig, plotNum: number, slotNum: number, slotShouldExist?: boolean): Promise<null | [Plot, Slot]>;
    protected static printPlotInfo(plot: Plot, plotNum: number, detailed?: boolean, indent?: number): string;
    protected static printSlotInfo(slot: Slot, slotNum: number, indent?: number): string;
    register(interaction: CommandInteraction, config: GardeningConfig, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number): Promise<void>;
    cancel(interaction: CommandInteraction, config: GardeningConfig, player: string, plant: string, plotNum: number, slotNum: number): Promise<void>;
    list(interaction: CommandInteraction, config: GardeningConfig, plotNum: number, slotNum: number): Promise<void>;
    tick(client: Client): Promise<void>;
    postChannelMessage(client: Client, config: GardeningConfig, messageArgs: MessagePostArgs): Promise<void>;
    private subCommandResolver;
}
declare class MessagePostArgs {
    title: string;
    description: string;
    memberUrl: string;
    slot?: Slot;
    fields: EmbedFieldData[];
}
export {};
//# sourceMappingURL=gardening.module.d.ts.map