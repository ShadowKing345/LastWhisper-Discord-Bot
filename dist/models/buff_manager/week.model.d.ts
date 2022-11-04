import { Days } from "./days.model.js";
import { MergeableObjectBase } from "../../utils/objects/mergeableObjectBase.js";
import { DateTime } from "luxon";
export declare class Week extends MergeableObjectBase<Week> {
    isEnabled: boolean;
    title: string;
    days: Days;
    getBuffId(date: DateTime): string;
    merge(obj: Week): Week;
}
//# sourceMappingURL=week.model.d.ts.map