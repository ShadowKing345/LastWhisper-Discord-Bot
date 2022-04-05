export class ReminderTrigger {
    public message: string;
    public timeDelta: string;

    constructor(message: string, timeDelta: string) {
        this.message = message;
        this.timeDelta = timeDelta;
    }
}

export class EventObj {
    public messageId: string;
    public name: string;
    public description: string;
    public dateTime: Date;
    public additional: [ string, string ][];

    constructor(messageId: string, name = "", description = "", dateTime: Date = null, additional: [ string, string ][] = []) {
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

export class Tags {
    public announcement: string;
    public description: string;
    public dateTime: string;
    public exclusionList: string[];

    constructor(announcement = "Event Announcement", description = "Event Description", dateTime = "Time", exclusionList: string[] = []) {
        this.announcement = announcement;
        this.description = description;
        this.dateTime = dateTime;
        this.exclusionList = exclusionList;
    }
}

export class EventManagerConfig {
    public guildId: string;
    public listenerChannelId: string | null;
    public postingChannelId: string | null;
    public delimiterCharacters: [ string, string ];
    public tags: Tags;
    public dateTimeFormat: string[];
    public events: EventObj[];
    public reminders: ReminderTrigger[];

    constructor(id = "", listenerChannelId: string = null, postingChannelId: string = null, delimiterCharacters: [ string, string ] = [ "\\[", "\\]" ], tags: Tags = new Tags(), dateTimeFormat: string[] = [], events: EventObj[] = [], reminders: ReminderTrigger[] = []) {
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
