import { Buff } from "./buff.js";
import { MessageSettings } from "./messageSettings.js";
import { Week } from "./week.js";
import { DateTime } from "luxon";
import { EntityBase } from "../entityBase.js";
export declare class BuffManagerConfig extends EntityBase {
    messageSettings: MessageSettings;
    buffs: Buff[];
    weeks: Week[];
    getWeekOfYear(date: DateTime): Week;
    get getFilteredWeeks(): Week[];
    getBuff(buffId: string): Buff | null;
    nullChecks(): void;
}
//# sourceMappingURL=buffManagerConfig.d.ts.map