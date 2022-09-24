import { Days } from "./days.model.js";
import { SanitizeObjectBase } from "../../utils/objects/sanitizeObjectBase.js";
import { deepMerge } from "../../utils/index.js";

/**
 * Information about a week.
 */
export class Week extends SanitizeObjectBase<Week> {
    public isEnabled: boolean;
    public title: string;
    public days: Days = new Days();

    public sanitizeObject(newObj: Week): Week {
        super.sanitizeObject(newObj);

        this.days = deepMerge(new Days, this.days);

        return this;
    }
}