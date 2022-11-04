import { Duration } from "luxon";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export declare class Reminder extends ToJsonBase<Reminder> {
    message: string;
    timeDelta: string;
    constructor(data?: Partial<Reminder>);
    get asDuration(): Duration;
}
//# sourceMappingURL=reminderTrigger.model.d.ts.map