"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSettings = exports.Day = exports.Days = exports.Week = exports.BuffManagerConfig = void 0;
const uuid_1 = require("uuid");
class Day {
    constructor(text = "", imageUrl = "") {
        this.id = (0, uuid_1.v4)();
        this.text = text;
        this.imageUrl = imageUrl;
    }
}
exports.Day = Day;
class Days {
    constructor(monday = null, tuesday = null, wednesday = null, thursday = null, friday = null, saturday = null, sunday = null) {
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
        this.saturday = saturday;
        this.sunday = sunday;
    }
}
exports.Days = Days;
class Week {
    constructor(title, days = new Days()) {
        this.title = title;
        this.days = days;
    }
}
exports.Week = Week;
class MessageSettings {
    constructor(channelId = "", hour = "", dow = null, buffMessage = "Today's Buff Shall Be:", weekMessage = "This Week's Buffs Are:") {
        this.channelId = channelId;
        this.hour = hour;
        this.dow = dow;
        this.buffMessage = buffMessage;
        this.weekMessage = weekMessage;
    }
}
exports.MessageSettings = MessageSettings;
class BuffManagerConfig {
    constructor(id = "", messageSettings = null, days = [], weeks = []) {
        this._id = id;
        this.messageSettings = messageSettings;
        this.days = days;
        this.weeks = weeks;
    }
}
exports.BuffManagerConfig = BuffManagerConfig;
