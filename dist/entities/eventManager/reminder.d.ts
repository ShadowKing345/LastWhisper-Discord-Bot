import { Duration } from "luxon";
import { BaseEntity, Relation } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";
export declare class Reminder extends BaseEntity {
    id: string;
    message: string;
    timeDelta: string;
    guildConfig: Relation<EventManagerConfig>;
    constructor();
    get asDuration(): Duration;
}
//# sourceMappingURL=reminder.d.ts.map