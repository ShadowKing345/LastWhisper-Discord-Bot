import { Duration, DateTime } from "luxon";
import { BaseEntity } from "typeorm";
export class Reminder extends BaseEntity {
    message = null;
    timeDelta = null;
    constructor() {
        super();
    }
    get asDuration() {
        const hold = DateTime.fromFormat(this.timeDelta, "HH:mm");
        return Duration.fromObject({
            hours: hold.get("hour"),
            minutes: hold.get("minute"),
        });
    }
}
//# sourceMappingURL=reminderTrigger.js.map