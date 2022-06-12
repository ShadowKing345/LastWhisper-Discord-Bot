import { PermissionManagerService } from "../permission_manager/index.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { BuffManagerService } from "./buffManager.service.js";
export declare class BuffManagerModule extends ModuleBase {
    private buffManagerService;
    private permissionManager;
    private static readonly commands;
    private readonly logger;
    constructor(buffManagerService: BuffManagerService, permissionManager: PermissionManagerService);
    private subcommandResolver;
    private postTodayBuff;
    private postTomorrowsBuff;
    private postThisWeeksBuffs;
    private postNextWeeksBuffs;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.module.d.ts.map