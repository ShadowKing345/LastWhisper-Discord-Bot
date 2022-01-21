import {SchemaDefinitionProperty} from "mongoose";

class ReminderTrigger {
    message: string;
    timeDelta: string;

    constructor(message: string, timeDelta: string) {
        this.message = message;
        this.timeDelta = timeDelta;
    }
}

class EventObj {
    messageId: string;
    name: string;
    description: string;
    dateTime: Date;
    additional: [string, string][];

    constructor(messageId: string, name: string = "", description: string = "", dateTime: Date = null, additional: [string, string][] = []) {
        this.messageId = messageId;
        this.name = name;
        this.description = description;
        this.dateTime = dateTime;
        this.additional = additional;
    }

    get isValid(): boolean {
        return this.name != "" && this.description != "" && this.dateTime != null;
    }
}

class Tags {
    announcement: string;
    description: string;
    dateTime: string;
    exclusionList: string[];

    constructor(announcement: string = "Event Announcement", description: string = "Event Description", dateTime: string = "Time", exclusionList: string[] = []) {
        this.announcement = announcement;
        this.description = description;
        this.dateTime = dateTime;
        this.exclusionList = exclusionList;
    }
}

class EventManagerConfig {
    _id: string;
    listenerChannelId: string | null;
    postingChannelId: string | null;
    delimiterCharacters: [string, string] | SchemaDefinitionProperty<[string, string]>;
    tags: Tags;
    dateTimeFormat: string[];
    events: EventObj[];
    reminders: ReminderTrigger[];

    constructor(id: string = "", listenerChannelId: string = null, postingChannelId: string = null, delimiterCharacters: [string, string] = ["\\[", "\\]"], tags: Tags = new Tags(), dateTimeFormat: string[] = [], events: EventObj[] = [], reminders: ReminderTrigger[] = []) {
        this._id = id;
        this.listenerChannelId = listenerChannelId;
        this.postingChannelId = postingChannelId;
        this.delimiterCharacters = delimiterCharacters;
        this.tags = tags;
        this.dateTimeFormat = dateTimeFormat;
        this.events = events;
        this.reminders = reminders;
    }
}

export {ReminderTrigger, EventObj, EventManagerConfig, Tags};
