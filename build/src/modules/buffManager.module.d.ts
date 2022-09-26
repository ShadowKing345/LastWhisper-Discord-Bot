import { pino } from "pino";
import { ModuleBase } from "../utils/models/index.js";
import { BuffManagerService } from "../services/buffManager.service.js";
export declare class BuffManagerModule extends ModuleBase {
    private buffManagerService;
    private logger;
    private static readonly commands;
    constructor(buffManagerService: BuffManagerService, logger: pino.Logger);
    private subcommandResolver;
    private postTodayBuff;
    private postTomorrowsBuff;
    private postThisWeeksBuffs;
    private postNextWeeksBuffs;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.module.d.ts.map