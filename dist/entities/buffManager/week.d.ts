import { Days } from "./days.js";
import { DateTime } from "luxon";
import { EntityBase } from "../entityBase.js";
export declare class Week extends EntityBase {
    isEnabled: boolean;
    title: string;
    days: Days;
    getBuffId(date: DateTime): string;
    merge(obj: Week): Week;
}
//# sourceMappingURL=week.d.ts.map