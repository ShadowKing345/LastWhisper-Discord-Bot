import { IEntity } from "../../utils/objects/repositoryBase.js";
import { EventObj } from "./eventObj.model.js";
import { ReminderTrigger } from "./reminderTrigger.model.js";
import { Tags } from "./tags.model.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export declare class EventManagerConfig extends ToJsonBase<EventManagerConfig> implements IEntity<string> {
    _id: string;
    guildId: string;
    listenerChannelId: string | null;
    postingChannelId: string | null;
    delimiterCharacters: [string, string];
    tags: Tags;
    dateTimeFormat: string;
    events: EventObj[];
    reminders: ReminderTrigger[];
}
//# sourceMappingURL=eventManagerConfig.model.d.ts.map