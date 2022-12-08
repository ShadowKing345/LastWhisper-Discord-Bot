import { CommandInteraction, InteractionResponse, ChatInputCommandInteraction, APIEmbedField } from "discord.js";
import { pino } from "pino";
import { Client } from "../utils/objects/client.js";
import { GardeningManagerRepository } from "../repositories/gardeningManager.js";
import { GardeningModuleConfig, Plot, Reason, Slot } from "../entities/gardeningManager/index.js";
import { Service } from "./service.js";
export declare class GardeningManagerService extends Service {
    private repository;
    private logger;
    constructor(repository: GardeningManagerRepository, logger: pino.Logger);
    private getConfig;
    protected static validatePlotAndSlot(interaction: CommandInteraction, config: GardeningModuleConfig, plotNum: number, slotNum: number, slotShouldExist?: boolean): Promise<null | [Plot, Slot]>;
    protected static printPlotInfo(plot: Plot, plotNum: number, detailed?: boolean, indent?: number): string;
    protected static printSlotInfo(slot: Slot, slotNum: number, indent?: number): string;
    register(interaction: CommandInteraction, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number): Promise<void>;
    cancel(interaction: ChatInputCommandInteraction, player: string, plant: string, plotNum: number, slotNum: number): Promise<InteractionResponse | void>;
    list(interaction: ChatInputCommandInteraction, plotNum: number, slotNum: number): Promise<InteractionResponse<boolean>>;
    tick(client: Client): Promise<void>;
    postChannelMessage(client: Client, config: GardeningModuleConfig, messageArgs: MessagePostArgs): Promise<void>;
}
export declare class MessagePostArgs {
    title: string;
    description: string;
    memberUrl: string;
    slot?: Slot;
    fields: APIEmbedField[];
}
//# sourceMappingURL=gardeningManager.d.ts.map