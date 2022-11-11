import { Duration, DateTime } from "luxon";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";

/**
 * Reminder trigger. Used to calculate how long until an event reminder needs to be sent.
 */
export class Reminder extends ToJsonBase<Reminder> {
  public message: string = null;
  public timeDelta: string = null;

  constructor(data: Partial<Reminder> = null) {
    super();

    if (data) {
      this.merge(data);
    }
  }

  /**
   * Returns the duration equivalent of the time delta variable.
   */
  public get asDuration(): Duration {
    const hold = DateTime.fromFormat(this.timeDelta, "HH:mm");
    return Duration.fromObject({
      hours: hold.get("hour"),
      minutes: hold.get("minute"),
    });
  }
}
