import { CommandInteraction, InteractionResponse, ChatInputCommandInteraction, APIEmbedField } from "discord.js";
import { pino } from "pino";
import { Client } from "../utils/models/client.js";
import { GardeningManagerRepository } from "../repositories/gardeningManager.repository.js";
import { GardeningModuleConfig, Plot, Reason, Slot } from "../models/gardening_manager/index.js";
export declare class GardeningManagerService {
    private gardeningConfigRepository;
    private logger;
    constructor(gardeningConfigRepository: GardeningManagerRepository, logger: pino.Logger);
    protected static validatePlotAndSlot(interaction: CommandInteraction, config: GardeningModuleConfig, plotNum: number, slotNum: number, slotShouldExist?: boolean): Promise<null | [Plot, Slot]>;
    protected static printPlotInfo(plot: Plot, plotNum: number, detailed?: boolean, indent?: number): string;
    protected static printSlotInfo(slot: Slot, slotNum: number, indent?: number): string;
    register(interaction: CommandInteraction, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number): Promise<void>;
    cancel(interaction: ChatInputCommandInteraction, player: string, plant: string, plotNum: number, slotNum: number): Promise<InteractionResponse>;
    list(interaction: ChatInputCommandInteraction, plotNum: number, slotNum: number): Promise<InteractionResponse<boolean>>;
    tick(client: Client): Promise<void>;
    postChannelMessage(client: Client, config: GardeningModuleConfig, messageArgs: MessagePostArgs): Promise<void>;
    private findOneOrCreate;
}
export declare class MessagePostArgs {
    title: string;
    description: string;
    memberUrl: string;
    slot?: Slot;
    fields: APIEmbedField[];
}
//# sourceMappingURL=gardeningManager.service.d.ts.map