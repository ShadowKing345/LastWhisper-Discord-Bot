import { ModuleBase } from "../classes/moduleBase.js";
export declare class BuffManagerModule extends ModuleBase {
    private readonly loggerMeta;
    private readonly daysOfWeek;
    private service;
    constructor();
    private createBuffEmbed;
    private createWeekEmbed;
    private tryGetConfig;
    private postBuff;
    private postWeeksBuffs;
    private postDailyMessage;
}
