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
    merge(newObj) {
        super.merge(newObj);
        this.days = deepMerge(new Days, this.days);
        return this;
    }
}
//# sourceMappingURL=week.model.js.map