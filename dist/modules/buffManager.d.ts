import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "./module.js";
import { BuffManagerService } from "../services/buffManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { SlashCommands } from "../objects/index.js";
import { Timers } from "../objects/timer.js";
import { Logger } from "../config/logger.js";
export declare class BuffManagerModule extends Module {
    private service;
    protected logger: Logger;
    static permissionKeys: {
        buffs: string;
        weeks: string;
    };
    moduleName: string;
    timers: Timers;
    commands: SlashCommands;
    protected commandResolverKeys: {
        "buff_manager.buffs": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "buff_manager.weeks": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    constructor(service: BuffManagerService, permissionManagerService: PermissionManagerService);
    private postBuffCommand;
    private postWeekCommand;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.d.ts.map