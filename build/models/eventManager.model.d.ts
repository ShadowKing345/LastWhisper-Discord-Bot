export declare class ReminderTrigger {
    message: string;
    timeDelta: string;
    constructor(message: string, timeDelta: string);
}
export declare class EventObj {
    messageId: string;
    name: string;
    description: string;
    dateTime: Date;
    additional: [string, string][];
    constructor(messageId: string, name?: string, description?: string, dateTime?: Date, additional?: [string, string][]);
    get isValid(): boolean;
}
export declare class Tags {
    announcement: string;
    description: string;
    dateTime: string;
    exclusionList: string[];
    constructor(announcement?: string, description?: string, dateTime?: string, exclusionList?: string[]);
}
export declare class EventManagerConfig {
    guildId: string;
    listenerChannelId: string | null;
    postingChannelId: string | null;
    delimiterCharacters: [string, string];
    tags: Tags;
    dateTimeFormat: string[];
    events: EventObj[];
    reminders: ReminderTrigger[];
    constructor(id?: string, listenerChannelId?: string, postingChannelId?: string, delimiterCharacters?: [string, string], tags?: Tags, dateTimeFormat?: string[], events?: EventObj[], reminders?: ReminderTrigger[]);
}
