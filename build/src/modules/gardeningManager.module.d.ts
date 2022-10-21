import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { GardeningManagerService } from "../services/gardeningManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
import { Timers } from "../utils/objects/timer.js";
export declare class GardeningManagerModule extends ModuleBase {
    private gardeningManagerService;
    moduleName: string;
    commands: Commands;
    timers: Timers;
    protected commandResolverKeys: {
        [key: string]: Function;
    };
    constructor(gardeningManagerService: GardeningManagerService, permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private reserve;
    private cancel;
    private list;
    private tick;
    protected commandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
}
//# sourceMappingURL=gardeningManager.module.d.ts.map