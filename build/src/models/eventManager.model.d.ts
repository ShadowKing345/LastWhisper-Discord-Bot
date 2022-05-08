import { BasicModel } from "./basicModel.js";
export declare class ReminderTrigger {
    message: string;
    timeDelta: string;
    constructor(message: string, timeDelta: string);
}
export declare class EventObj {
    messageId: string;
    name: string;
    description: string;
    dateTime: number;
    additional: [string, string][];
    constructor(messageId: string, name?: string, description?: string, dateTime?: number, additional?: [string, string][]);
    static isValid(obj: EventObj): boolean;
}
export declare class Tags {
    announcement: string;
    description: string;
    dateTime: string;
    exclusionList: string[];
    constructor(announcement?: string, description?: string, dateTime?: string, exclusionList?: string[]);
}
export declare class EventManagerConfig extends BasicModel {
    guildId: string;
    listenerChannelId: string | null;
    postingChannelId: string | null;
    delimiterCharacters: [string, string];
    tags: Tags;
    dateTimeFormat: string;
    events: EventObj[];
    reminders: ReminderTrigger[];
}
//# sourceMappingURL=eventManager.model.d.ts.map