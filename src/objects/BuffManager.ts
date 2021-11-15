import {v4 as uuid} from "uuid";
import mongoose, {SchemaDefinitionProperty} from "mongoose";

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

    getDay(day: string): string | null {
        switch (day) {
            case "monday":
                return this.monday;
            case "tuesday":
                return this.tuesday;
            case "wednesday":
                return this.wednesday;
            case "thursday":
                return this.thursday;
            case "friday":
                return this.friday;
            case "saturday":
                return this.saturday;
            case "sunday":
                return this.sunday;
        }
    }

    getDayInt(day: number): string | null {
        switch (day) {
            case 1:
                return this.monday;
            case 2:
                return this.tuesday;
            case 3:
                return this.wednesday;
            case 4:
                return this.thursday;
            case 5:
                return this.friday;
            case 6:
                return this.saturday;
            case 0:
                return this.sunday;
        }
    }

    get array() {
        return [this.sunday, this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday];
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

const schema = new mongoose.Schema<BuffManagerConfig>({
    _id: String,
    messageSettings: {
        type: Object,
        default: new MessageSettings
    },
    days: Array,
    weeks: Array
});

const Model = mongoose.model<BuffManagerConfig>("BuffManager", schema);

export default Model;
export {BuffManagerConfig, Week, Day, MessageSettings};
