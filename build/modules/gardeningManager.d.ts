import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "./module.js";
import { GardeningManagerService } from "../services/gardeningManager.js";
import { Reason } from "../entities/gardeningManager/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { SlashCommands } from "../objects/index.js";
import { Timers } from "../objects/timer.js";
import { Logger } from "../config/logger.js";
export declare class GardeningManagerModule extends Module {
    private gardeningManagerService;
    protected static readonly logger: Logger;
    moduleName: string;
    commands: SlashCommands;
    timers: Timers;
    protected commandResolverKeys2: {
        "gardening_module.reserve": (interaction: ChatInputCommandInteraction, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number) => Promise<InteractionResponse | void>;
        "gardening_module.list": (interaction: ChatInputCommandInteraction, plotNum: number, slotNum: number) => Promise<InteractionResponse | void>;
        "gardening_module.cancel": (interaction: ChatInputCommandInteraction, player: string, plant: string, plotNum: number, slotNum: number) => Promise<InteractionResponse | void>;
    };
    constructor(gardeningManagerService: GardeningManagerService, permissionManagerService: PermissionManagerService);
    private reserve;
    private cancel;
    private list;
    private tick;
}
//# sourceMappingURL=gardeningManager.d.ts.map