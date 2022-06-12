import { ModuleBase } from "../shared/models/moduleBase.js";
import { BuffManagerService } from "./buffManager.service.js";
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