import { EventObj } from "./eventObj.model.js";
import { Reminder } from "./reminderTrigger.model.js";
import { Tags } from "./tags.model.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { deepMerge } from "../../utils/index.js";
export class EventManagerConfig extends ToJsonBase {
    _id;
    guildId = null;
    listenerChannelId = null;
    postingChannelId = null;
    delimiterCharacters = ["[", "]"];
    tags = new Tags();
    dateTimeFormat = [];
    events = [];
    reminders = [];
    getEventByIndex(index) {
        return this.events[index % this.events.length];
    }
    merge(obj) {
        if (obj._id) {
            this._id = obj._id;
        }
        if (obj.guildId) {
            this.guildId = obj.guildId;
        }
        if (obj.listenerChannelId) {
            this.listenerChannelId = obj.listenerChannelId;
        }
        if (obj.postingChannelId) {
            this.postingChannelId = obj.postingChannelId;
        }
        if (obj.delimiterCharacters) {
            this.delimiterCharacters = obj.delimiterCharacters;
        }
        if (obj.tags) {
            this.tags = deepMerge(this.tags ?? new Tags(), obj.tags);
        }
        if (obj.dateTimeFormat) {
            this.dateTimeFormat = obj.dateTimeFormat;
        }
        if (obj.events) {
            this.events = obj.events.map(event => deepMerge(new EventObj(), event));
        }
        if (obj.reminders) {
            this.reminders = obj.reminders.map(reminder => deepMerge(new Reminder(), reminder));
        }
        return this;
    }
}
//# sourceMappingURL=eventManagerConfig.model.js.map