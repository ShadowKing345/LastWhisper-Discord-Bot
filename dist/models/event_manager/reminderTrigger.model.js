import { Duration, DateTime } from "luxon";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export class Reminder extends ToJsonBase {
    message = null;
    timeDelta = null;
    constructor(data = null) {
        super();
        if (data) {
            this.merge(data);
        }
    }
    get asDuration() {
        const hold = DateTime.fromFormat(this.timeDelta, "HH:mm");
        return Duration.fromObject({
            hours: hold.get("hour"),
            minutes: hold.get("minute"),
        });
    }
}
//# sourceMappingURL=reminderTrigger.model.js.map