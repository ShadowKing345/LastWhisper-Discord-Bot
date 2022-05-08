import { BasicModel } from "./basicModel.js";
export class ReminderTrigger {
    message = null;
    timeDelta = null;
    constructor(message, timeDelta) {
        this.message = message;
        this.timeDelta = timeDelta;
    }
}
export class EventObj {
    messageId = null;
    name = null;
    description = null;
    dateTime = null;
    additional = [];
    constructor(messageId, name = "", description = "", dateTime = null, additional = []) {
        this.messageId = messageId;
        this.name = name;
        this.description = description;
        this.dateTime = dateTime;
        this.additional = additional;
    }
    static isValid(obj) {
        return obj.name != "" && obj.description != "" && obj.dateTime != null;
    }
}
export class Tags {
    announcement = null;
    description = null;
    dateTime = null;
    exclusionList = [];
    constructor(announcement = "Event Announcement", description = "Event Description", dateTime = "Time", exclusionList = []) {
        this.announcement = announcement;
        this.description = description;
        this.dateTime = dateTime;
        this.exclusionList = exclusionList;
    }
}
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
//# sourceMappingURL=eventManager.model.js.map