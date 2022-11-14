import { Days } from "./days.js";
import { MergeObjectBase } from "../../utils/objects/mergeObjectBase.js";
import { DateTime } from "luxon";
export declare class Week extends MergeObjectBase<Week> {
    isEnabled: boolean;
    title: string;
    days: Days;
    getBuffId(date: DateTime): string;
    merge(obj: Week): Week;
}
//# sourceMappingURL=week.d.ts.map