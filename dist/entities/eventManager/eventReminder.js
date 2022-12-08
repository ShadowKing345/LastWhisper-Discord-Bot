import { __decorate, __metadata } from "tslib";
import { Duration, DateTime } from "luxon";
import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";
let EventReminder = class EventReminder extends EntityBase {
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
};
__decorate([
    Column(),
    __metadata("design:type", String)
], EventReminder.prototype, "message", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], EventReminder.prototype, "timeDelta", void 0);
EventReminder = __decorate([
    Entity(),
    __metadata("design:paramtypes", [])
], EventReminder);
export { EventReminder };
//# sourceMappingURL=eventReminder.js.map