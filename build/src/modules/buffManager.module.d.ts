import { pino } from "pino";
import { ModuleBase, Task } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandBuilders } from "../utils/objects/commandBuilder.js";
export declare class BuffManagerModule extends ModuleBase {
    private buffManagerService;
    private logger;
    moduleName: string;
    tasks: Task[];
    commands: CommandBuilders;
    constructor(buffManagerService: BuffManagerService, logger: pino.Logger, permissionManagerService: PermissionManagerService);
    private subcommandResolver;
    private postTodayBuff;
    private postTomorrowsBuff;
    private postThisWeeksBuffs;
    private postNextWeeksBuffs;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.module.d.ts.map