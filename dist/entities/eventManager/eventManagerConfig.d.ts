import { EventObject } from "./eventObject.js";
import { EventReminder } from "./eventReminder.js";
import { EntityBase } from "../entityBase.js";
export declare class EventManagerConfig extends EntityBase {
    listenerChannelId: string;
    postingChannelId: string;
    delimiterCharacters: [string, string];
    announcement: string;
    description: string;
    dateTime: string;
    exclusionList: string[];
    dateTimeFormat: string[];
    events: EventObject[];
    reminders: EventReminder[];
    constructor(announcement?: string, description?: string, dateTime?: string, exclusionList?: string[]);
    getEventByIndex(index: number): EventObject;
    nullChecks(): void;
}
//# sourceMappingURL=eventManagerConfig.d.ts.map