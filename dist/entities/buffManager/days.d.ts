import { Buff } from "./buff.js";
import { EntityBase } from "../entityBase.js";
import { WeekDays } from "./weekDays.js";
export declare class Days extends EntityBase {
    monday: Buff;
    tuesday: Buff;
    wednesday: Buff;
    thursday: Buff;
    friday: Buff;
    saturday: Buff;
    sunday: Buff;
    private current;
    private get array();
    [Symbol.iterator](): this;
    next(): {
        done: boolean;
        value: Buff;
    };
    get toArray(): [WeekDays, Buff][];
}
//# sourceMappingURL=days.d.ts.map