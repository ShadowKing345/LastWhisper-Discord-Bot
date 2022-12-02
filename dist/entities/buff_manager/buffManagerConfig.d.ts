import { Buff } from "./buff.js";
import { MessageSettings } from "./messageSettings.js";
import { Week } from "./week.js";
import { IEntity } from "../../utils/objects/repository.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { DateTime } from "luxon";
export declare class BuffManagerConfig extends ToJsonBase<BuffManagerConfig> implements IEntity<string> {
    _id: string;
    id: string;
    guildId: string;
    messageSettings: MessageSettings;
    buffs: Buff[];
    weeks: Week[];
    getWeekOfYear(date: DateTime): Week;
    get getFilteredWeeks(): Week[];
    getBuff(buffId: string): Buff | null;
    merge(obj: BuffManagerConfig): BuffManagerConfig;
}
//# sourceMappingURL=buffManagerConfig.d.ts.map