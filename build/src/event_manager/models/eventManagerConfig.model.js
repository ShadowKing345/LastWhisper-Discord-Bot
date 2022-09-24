import { BasicModel } from "../../utils/models/index.js";
import { Tags } from "./tags.model.js";
export class EventManagerConfig extends BasicModel {
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