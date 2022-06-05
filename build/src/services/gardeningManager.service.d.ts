import { CommandInteraction, EmbedFieldData } from "discord.js";
import { Client } from "../classes/client.js";
import { GardeningConfig, Plot, Reason, Slot } from "../models/gardeningConfig.model.js";
import { GardeningConfigRepository } from "../repositories/gardeningConfig.repository.js";
export declare class GardeningManagerService {
    private repo;
    private readonly logger;
    constructor(repo: GardeningConfigRepository);
    protected static validatePlotAndSlot(interaction: CommandInteraction, config: GardeningConfig, plotNum: number, slotNum: number, slotShouldExist?: boolean): Promise<null | [Plot, Slot]>;
    protected static printPlotInfo(plot: Plot, plotNum: number, detailed?: boolean, indent?: number): string;
    protected static printSlotInfo(slot: Slot, slotNum: number, indent?: number): string;
    register(interaction: CommandInteraction, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number): Promise<void>;
    cancel(interaction: CommandInteraction, player: string, plant: string, plotNum: number, slotNum: number): Promise<void>;
    list(interaction: CommandInteraction, plotNum: number, slotNum: number): Promise<void>;
    tick(client: Client): Promise<void>;
    postChannelMessage(client: Client, config: GardeningConfig, messageArgs: MessagePostArgs): Promise<void>;
    private findOneOrCreate;
}
declare class MessagePostArgs {
    title: string;
    description: string;
    memberUrl: string;
    slot?: Slot;
    fields: EmbedFieldData[];
}
export {};
//# sourceMappingURL=gardeningManager.service.d.ts.map