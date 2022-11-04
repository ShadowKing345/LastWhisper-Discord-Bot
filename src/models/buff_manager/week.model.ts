import { Days } from "./days.model.js";
import { MergeableObjectBase } from "../../utils/objects/mergeableObjectBase.js";
import { deepMerge } from "../../utils/index.js";
import { DateTime } from "luxon";

/**
 * Information about a week.
 */
export class Week extends MergeableObjectBase<Week> {
  public isEnabled = false;
  public title: string = null;
  public days: Days = new Days();

  /**
   * Returns the buff ID for a given day of the week,
   * @param date The date object to get the string from.
   */
  public getBuffId(date: DateTime): string {
    return Array(...this.days)[date.weekday - 1];
  }

  public merge(obj: Week): Week {
    if (obj.isEnabled) {
      this.isEnabled = obj.isEnabled;
    }

    if (obj.title) {
      this.title = obj.title;
    }

    if (obj.days) {
      this.days = deepMerge(this.days ?? new Days(), obj.days);
    }

    return this;
  }
}
