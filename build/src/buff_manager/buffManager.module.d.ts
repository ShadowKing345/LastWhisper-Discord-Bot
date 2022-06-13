import { pino } from "pino";
import { PermissionManagerService } from "../permission_manager/index.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { BuffManagerService } from "./buffManager.service.js";
export declare class BuffManagerModule extends ModuleBase {
    private buffManagerService;
    private permissionManager;
    private logger;
    private static readonly commands;
    constructor(buffManagerService: BuffManagerService, permissionManager: PermissionManagerService, logger: pino.Logger);
    private subcommandResolver;
    private postTodayBuff;
    private postTomorrowsBuff;
    private postThisWeeksBuffs;
    private postNextWeeksBuffs;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.module.d.ts.map