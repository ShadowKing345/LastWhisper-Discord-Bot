import { Days } from "./days.model.js";
import { MergeableObjectBase } from "../../utils/objects/mergeableObjectBase.js";
/**
 * Information about a week.
 */
export declare class Week extends MergeableObjectBase<Week> {
    isEnabled: boolean;
    title: string;
    days: Days;
    merge(obj: Week): Week;
}
//# sourceMappingURL=week.model.d.ts.map