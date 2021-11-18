import {v4 as uuid} from "uuid";
import {SchemaDefinitionProperty} from "mongoose";

class Day {
    id: string;
    text: string;
    imageUrl: string;

    constructor(text: string, imageUrl: string) {
        this.id = uuid();
        this.text = text;
        this.imageUrl = imageUrl;
    }
}

class Days {
    monday: string | null;
    tuesday: string | null;
    wednesday: string | null;
    thursday: string | null;
    friday: string | null;
    saturday: string | null;
    sunday: string | null;

    constructor(monday: string = null, tuesday: string = null, wednesday: string = null, thursday: string = null, friday: string = null, saturday: string = null, sunday: string = null) {
        this.monday = monday
        this.tuesday = tuesday
        this.wednesday = wednesday
        this.thursday = thursday
        this.friday = friday
        this.saturday = saturday
        this.sunday = sunday
    }
}

class Week {
    title: string;
    days: Days;

    constructor(title: string, days: Days = new Days()) {
        this.title = title;
        this.days = days;
    }
}

class MessageSettings {
    channelId: string;
    hour: string;
    dow: number | null;
    buffMessage: string;
    weekMessage: string;

    constructor(channelId: string = "", hour: string = "", dow: number | null = null, buffMessage: string = "Today's Buff Shall Be:", weekMessage: string = "This Week's Buffs Are:") {
        this.channelId = channelId;
        this.hour = hour;
        this.dow = dow;
        this.buffMessage = buffMessage;
        this.weekMessage = weekMessage;
    }
}

interface BuffManagerConfig {
    _id: string,
    messageSettings: SchemaDefinitionProperty<MessageSettings> | undefined;
    days: [Day];
    weeks: [Week];
}

export {BuffManagerConfig, Week, Days, Day, MessageSettings};
