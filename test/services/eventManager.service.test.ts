import "reflect-metadata";

import { Duration } from "luxon";
import { test } from "tap";
import { injectable } from "tsyringe";

import { EventManagerService } from "../../src/event_manager/index.js";

@injectable()
class mockClass extends EventManagerService {
    public static parseTriggerDuration(triggerTime: string): Duration {
        return EventManagerService.parseTriggerDuration(triggerTime);
    }
}

test("Event Manager Service Tests.", async t => {
    await t.test("Reminder time parsing", async t => {
        const duration = mockClass.parseTriggerDuration("04:45");
        // const now = DateTime.now();
        t.equal(duration.get("minutes"), 45);
        // t.equal(now.toUnixInteger(), duration.toU);
    });
});