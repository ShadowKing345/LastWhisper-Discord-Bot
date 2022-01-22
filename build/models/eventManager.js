"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManagerConfig = exports.Tags = exports.EventObj = exports.ReminderTrigger = void 0;
class ReminderTrigger {
    constructor(message, timeDelta) {
        this.message = message;
        this.timeDelta = timeDelta;
    }
}
exports.ReminderTrigger = ReminderTrigger;
class EventObj {
    constructor(messageId, name = "", description = "", dateTime = null, additional = []) {
        this.messageId = messageId;
        this.name = name;
        this.description = description;
        this.dateTime = dateTime;
        this.additional = additional;
    }
    get isValid() {
        return this.name != "" && this.description != "" && this.dateTime != null;
    }
}
exports.EventObj = EventObj;
class Tags {
    constructor(announcement = "Event Announcement", description = "Event Description", dateTime = "Time", exclusionList = []) {
        this.announcement = announcement;
        this.description = description;
        this.dateTime = dateTime;
        this.exclusionList = exclusionList;
    }
}
exports.Tags = Tags;
class EventManagerConfig {
    constructor(id = "", listenerChannelId = null, postingChannelId = null, delimiterCharacters = ["\\[", "\\]"], tags = new Tags(), dateTimeFormat = [], events = [], reminders = []) {
        this.guildId = id;
        this.listenerChannelId = listenerChannelId;
        this.postingChannelId = postingChannelId;
        this.delimiterCharacters = delimiterCharacters;
        this.tags = tags;
        this.dateTimeFormat = dateTimeFormat;
        this.events = events;
        this.reminders = reminders;
    }
}
exports.EventManagerConfig = EventManagerConfig;
