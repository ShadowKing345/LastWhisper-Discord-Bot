import { Tags } from "./tags.model.js";
/**
 * Event manager configuration object.
 */
export class EventManagerConfig {
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