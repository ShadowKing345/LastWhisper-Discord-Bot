import { Buff } from "./buff.js";
import { EntityBase } from "../entityBase.js";
import { WeekDays } from "./weekDays.js";
export declare class Days extends EntityBase {
    monday: Promise<Buff>;
    tuesday: Promise<Buff>;
    wednesday: Promise<Buff>;
    thursday: Promise<Buff>;
    friday: Promise<Buff>;
    saturday: Promise<Buff>;
    sunday: Promise<Buff>;
    private current;
    private get array();
    [Symbol.iterator](): this;
    next(): {
        done: boolean;
        value: Promise<Buff>;
    };
    get toArray(): [WeekDays, Promise<Buff>][];
}
//# sourceMappingURL=days.d.ts.map