import { Duration } from "luxon";
import { Relation } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";
import { EntityBase } from "../entityBase.js";
export declare class EventReminder extends EntityBase {
    message: string;
    timeDelta: string;
    guildConfig: Relation<EventManagerConfig>;
    constructor();
    get asDuration(): Duration;
}
//# sourceMappingURL=eventReminder.d.ts.map