import { Days } from "./days.model.js";
import { MergeableObjectBase } from "../../utils/objects/mergeableObjectBase.js";
import { deepMerge } from "../../utils/index.js";

/**
 * Information about a week.
 */
export class Week extends MergeableObjectBase<Week> {
    public isEnabled = false;
    public title: string = null;
    public days: Days = new Days();

    public merge(obj: Week): Week {
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