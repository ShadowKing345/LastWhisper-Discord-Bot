import { Buff } from "./buff.js";
export declare class Days {
    id: string;
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
}
//# sourceMappingURL=days.d.ts.map