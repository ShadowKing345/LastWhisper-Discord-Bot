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

    isValid(): boolean {
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

interface EventManagerConfig {
    _id: string;
    listenerChannelId: string;
    postingChannelId: string;
    delimiterCharacters: SchemaDefinitionProperty<string[]>;
    tags: SchemaDefinitionProperty<Tags> | undefined;
    dateTimeFormat: SchemaDefinitionProperty<[string]>;
    events: EventObj[];
    reminders: ReminderTrigger[];
}

export {ReminderTrigger, EventObj, EventManagerConfig, Tags};
