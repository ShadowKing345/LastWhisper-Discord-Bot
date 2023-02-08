import { Duration } from "luxon";
import { EntityBase } from "../entityBase.js";
export declare class EventReminder extends EntityBase {
    message: string;
    timeDelta: string;
    constructor();
    get asDuration(): Duration;
}
//# sourceMappingURL=eventReminder.d.ts.map