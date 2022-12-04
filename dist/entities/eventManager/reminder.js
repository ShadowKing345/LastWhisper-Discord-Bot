import { __decorate, __metadata } from "tslib";
import { Duration, DateTime } from "luxon";
import { BaseEntity, PrimaryGeneratedColumn, Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";
let Reminder = class Reminder extends BaseEntity {
    id;
    message = null;
    timeDelta = null;
    guildConfig;
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
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Reminder.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Reminder.prototype, "message", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Reminder.prototype, "timeDelta", void 0);
__decorate([
    ManyToOne(() => EventManagerConfig, config => config.reminders),
    JoinColumn({ name: "config_id" }),
    __metadata("design:type", Object)
], Reminder.prototype, "guildConfig", void 0);
Reminder = __decorate([
    Entity(),
    __metadata("design:paramtypes", [])
], Reminder);
export { Reminder };
//# sourceMappingURL=reminder.js.map