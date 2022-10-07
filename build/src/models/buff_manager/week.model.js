import { Days } from "./days.model.js";
import { MergeableObjectBase } from "../../utils/objects/mergeableObjectBase.js";
import { deepMerge } from "../../utils/index.js";
/**
 * Information about a week.
 */
export class Week extends MergeableObjectBase {
    isEnabled;
    title;
    days = new Days();
    merge(obj) {
        if (obj.isEnabled) {
            this.isEnabled = obj.isEnabled;
        }
        if (obj.title) {
            this.title = obj.title;
        }
        if (obj.days) {
            this.days = deepMerge(this.days ?? new Days, this.days);
        }
        return this;
    }
}
//# sourceMappingURL=week.model.js.map