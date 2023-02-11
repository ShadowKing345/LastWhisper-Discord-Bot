import { Days } from "./days.js";
import { DateTime } from "luxon";
import { EntityBase } from "../entityBase.js";
import { Buff } from "./buff.js";
export declare class Week extends EntityBase {
    isEnabled: boolean;
    title: string;
    days: Days;
    getBuff(date: DateTime): Promise<Buff>;
    merge(obj: Week): Week;
}
//# sourceMappingURL=week.d.ts.map