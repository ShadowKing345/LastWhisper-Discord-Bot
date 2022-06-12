import { ModuleBase } from "../classes/moduleBase.js";
import { BuffManagerService } from "../services/buffManager.service.js";
export declare class BuffManagerModule extends ModuleBase {
    private buffManagerService;
    private static readonly commands;
    private readonly logger;
    constructor(buffManagerService: BuffManagerService);
    private subCommandManager;
    private postBuff;
    private postWeeksBuffs;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.module.d.ts.map