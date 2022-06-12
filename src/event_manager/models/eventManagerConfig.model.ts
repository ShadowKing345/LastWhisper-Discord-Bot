import { BasicModel } from "../../shared/models/basicModel.js";
import { EventObj } from "./eventObj.model.js";
import { ReminderTrigger } from "./reminderTrigger.model.js";
import { Tags } from "./tags.model.js";

export class EventManagerConfig extends BasicModel {
    public guildId: string = null;
    public listenerChannelId: string | null = null;
    public postingChannelId: string | null = null;
    public delimiterCharacters: [string, string] = ["[", "]"];
    public tags: Tags = new Tags();
    public dateTimeFormat: string = null;
    public events: EventObj[] = [];
    public reminders: ReminderTrigger[] = [];
}
