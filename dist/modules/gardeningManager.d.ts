import { CommandInteraction, ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "../utils/models/index.js";
import { GardeningManagerService } from "../services/gardeningManager.js";
import { Reason } from "../entities/gardening_manager/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
import { Timers } from "../utils/objects/timer.js";
export declare class GardeningManagerModule extends Module {
    private gardeningManagerService;
    moduleName: string;
    commands: Commands;
    timers: Timers;
    protected commandResolverKeys: {
        "gardening_module.reserve": (interaction: CommandInteraction, player: string, plant: string, duration: number, reason: Reason, plotNum: number, slotNum: number) => Promise<void>;
        "gardening_module.list": (interaction: ChatInputCommandInteraction, plotNum: number, slotNum: number) => Promise<InteractionResponse<boolean>>;
        "gardening_module.cancel": (interaction: ChatInputCommandInteraction, player: string, plant: string, plotNum: number, slotNum: number) => Promise<InteractionResponse | void>;
    };
    constructor(gardeningManagerService: GardeningManagerService, permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private reserve;
    private cancel;
    private list;
    private tick;
    protected commandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
}
//# sourceMappingURL=gardeningManager.d.ts.map