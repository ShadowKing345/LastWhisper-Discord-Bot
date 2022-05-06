import { BasicModel } from "./basicModel.js";

export class ReminderTrigger {
    public message: string = null;
    public timeDelta: string = null;

    constructor(message: string, timeDelta: string) {
        this.message = message;
        this.timeDelta = timeDelta;
    }
}

export class EventObj {
    public messageId: string = null;
    public name: string = null;
    public description: string = null;
    public dateTime: number = null;
    public additional: [string, string][] = [];

    constructor(messageId: string, name = "", description = "", dateTime: number = null, additional: [string, string][] = []) {
        this.messageId = messageId;
        this.name = name;
        this.description = description;
        this.dateTime = dateTime;
        this.additional = additional;
    }

    static isValid(obj: EventObj): boolean {
        return obj.name != "" && obj.description != "" && obj.dateTime != null;
    }
}

export class Tags {
    public announcement: string = null;
    public description: string = null;
    public dateTime: string = null;
    public exclusionList: string[] = [];

    constructor(announcement = "Event Announcement", description = "Event Description", dateTime = "Time", exclusionList: string[] = []) {
        this.announcement = announcement;
        this.description = description;
        this.dateTime = dateTime;
        this.exclusionList = exclusionList;
    }
}

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
