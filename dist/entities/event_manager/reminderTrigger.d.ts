import { Duration } from "luxon";
import { BaseEntity } from "typeorm";
export declare class Reminder extends BaseEntity {
    message: string;
    timeDelta: string;
    constructor();
    get asDuration(): Duration;
}
//# sourceMappingURL=reminderTrigger.d.ts.map