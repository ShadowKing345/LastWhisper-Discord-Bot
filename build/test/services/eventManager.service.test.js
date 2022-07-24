var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DateTime } from "luxon";
import "reflect-metadata";
import { test } from "tap";
import { injectable } from "tsyringe";
import { EventManagerService } from "../../src/event_manager/index.js";
let mockClass = class mockClass extends EventManagerService {
    static parseTriggerDuration(triggerTime) {
        return EventManagerService.parseTriggerDuration(triggerTime);
    }
};
mockClass = __decorate([
    injectable()
], mockClass);
test("Event Manager Service Tests.", async (t) => {
    await t.test("Reminder time parsing", async (t) => {
        const duration = mockClass.parseTriggerDuration("04:45");
        const now = DateTime.now();
        t.equal(duration.get("minutes"), 45);
        // t.equal(now.toUnixInteger(), duration.toU);
    });
});
//# sourceMappingURL=eventManager.service.test.js.map