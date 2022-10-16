import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { ModuleBase, Task } from "../utils/models/index.js";
import { GardeningManagerService } from "../services/gardeningManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandBuilders } from "../utils/objects/commandBuilder.js";
import { pino } from "pino";
export declare class GardeningManagerModule extends ModuleBase {
    private gardeningManagerService;
    moduleName: string;
    commands: CommandBuilders;
    tasks: Task[];
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