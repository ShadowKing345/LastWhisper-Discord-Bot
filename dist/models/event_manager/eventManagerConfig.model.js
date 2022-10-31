import { Tags } from "./tags.model.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export class EventManagerConfig extends ToJsonBase {
    _id;
    guildId = null;
    listenerChannelId = null;
    postingChannelId = null;
    delimiterCharacters = ["[", "]"];
    tags = new Tags();
    dateTimeFormat = null;
    events = [];
    reminders = [];
}
//# sourceMappingURL=eventManagerConfig.model.js.map