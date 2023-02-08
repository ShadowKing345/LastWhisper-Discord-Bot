import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "./module.js";
import { BuffManagerService } from "../services/buffManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Timers } from "../objects/timer.js";
import { Logger } from "../config/logger.js";
export declare class BuffManagerModule extends Module {
    private service;
    protected static readonly logger: Logger;
    static permissionKeys: {
        buffs: string;
        weeks: string;
    };
    moduleName: string;
    timers: Timers;
    protected commandResolverKeys: {
        "buff_manager.buffs": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "buff_manager.weeks": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    constructor(service: BuffManagerService, permissionManagerService: PermissionManagerService);
    commandResolver(interaction: ChatInputCommandInteraction): Promise<void | InteractionResponse<boolean> | ((interaction: ChatInputCommandInteraction<import("discord.js").CacheType>, ...args: unknown[]) => Promise<void | InteractionResponse<boolean>>)>;
    private postBuffCommand;
    private postWeekCommand;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.d.ts.map