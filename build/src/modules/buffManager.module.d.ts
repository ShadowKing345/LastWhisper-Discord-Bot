import { ModuleBase } from "../classes/moduleBase.js";
import { BuffManagerConfigService } from "../services/buffManagerConfig.service.js";
export declare class BuffManagerModule extends ModuleBase {
    private service;
    private readonly loggerMeta;
    private readonly daysOfWeek;
    constructor(service: BuffManagerConfigService);
    private subCommandManager;
    private createBuffEmbed;
    private createWeekEmbed;
    private tryGetConfig;
    private postBuff;
    private postWeeksBuffs;
    private postDailyMessage;
}
//# sourceMappingURL=buffManager.module.d.ts.map