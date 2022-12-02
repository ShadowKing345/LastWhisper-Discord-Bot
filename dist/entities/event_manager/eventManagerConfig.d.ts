import { IEntity } from "../../utils/objects/repository.js";
import { EventObj } from "./eventObj.js";
import { Reminder } from "./reminderTrigger.js";
import { Tags } from "./tags.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export declare class EventManagerConfig extends ToJsonBase<EventManagerConfig> implements IEntity<string> {
    _id: string;
    guildId: string;
    listenerChannelId: string | null;
    postingChannelId: string | null;
    delimiterCharacters: [string, string];
    tags: Tags;
    dateTimeFormat: string[];
    events: EventObj[];
    reminders: Reminder[];
    getEventByIndex(index: number): EventObj;
    merge(obj: Partial<EventManagerConfig>): EventManagerConfig;
}
//# sourceMappingURL=eventManagerConfig.d.ts.map