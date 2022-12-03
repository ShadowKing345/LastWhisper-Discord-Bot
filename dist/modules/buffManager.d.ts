import { InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { Module } from "../utils/objects/index.js";
import { BuffManagerService } from "../services/buffManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Commands } from "../utils/objects/command.js";
import { Timers } from "../utils/objects/timer.js";
export declare class BuffManagerModule extends Module {
    private service;
    static permissionKeys: {
        buffs: string;
        weeks: string;
    };
    moduleName: string;
    timers: Timers;
    commands: Commands;
    protected commandResolverKeys: {
        "buff_manager.buffs": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "buff_manager.weeks": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    constructor(service: BuffManagerService, logger: pino.Logger, permissionManagerService: PermissionManagerService);
    private postBuffCommand;
    private postWeekCommand;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.d.ts.map