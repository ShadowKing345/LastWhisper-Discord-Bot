import { BasicModel } from "../../shared/models/basicModel.js";
import { EventObj } from "./eventObj.model.js";
import { ReminderTrigger } from "./reminderTrigger.model.js";
import { Tags } from "./tags.model.js";
export declare class EventManagerConfig extends BasicModel {
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