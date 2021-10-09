import mongoose, {SchemaDefinitionProperty} from "mongoose";

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
    dateTime: string;
    additional: { [key: string]: string };

    constructor(messageId: string, name: string = "", description: string = "", dateTime: string = "", additional: { [key: string]: string } = {}) {
        this.messageId = messageId;
        this.name = name;
        this.description = description;
        this.dateTime = dateTime;
        this.additional = additional;
    }

    isValid(): boolean {
        return this.name != "" && this.description != "" && this.dateTime != "";
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
    guildId: string;
    listenerChannelId: string;
    postingChannelId: string;
    delimiterCharacters: SchemaDefinitionProperty<[string, string]>;
    tags: SchemaDefinitionProperty<Tags> | undefined;
    dateTimeFormat: SchemaDefinitionProperty<[string]>;
    events: EventObj[];
    reminders: ReminderTrigger[];
}

const schema = new mongoose.Schema<EventManagerConfig>({
    guildId: {
        type: String,
        unique: true,
        required: true
    },
    listenerChannelId: {type: String, default: ""},
    postingChannelId: {type: String, default: ""},
    delimiterCharacters: {
        type: Array,
        default: ["\\[", "\\]"]
    },
    tags: {
        type: Object,
        default: new Tags
    },
    dateTimeFormat: {type: Array},
    events: Array,
    reminders: Array
});

const Model = mongoose.model<EventManagerConfig>("EventManager", schema);

export default Model;
export {ReminderTrigger, EventObj, EventManagerConfig, Tags};
