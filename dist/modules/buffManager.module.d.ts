import { InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { Commands } from "../utils/objects/command.js";
import { Timers } from "../utils/objects/timer.js";
export declare class BuffManagerModule extends ModuleBase {
    private buffManagerService;
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
    constructor(buffManagerService: BuffManagerService, logger: pino.Logger, permissionManagerService: PermissionManagerService);
    private postBuff;
    private postWeek;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.module.d.ts.map