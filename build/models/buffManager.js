"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuffManagerConfig = exports.MessageSettings = exports.Week = exports.Days = exports.Day = void 0;
class Day {
}
exports.Day = Day;
class Days {
}
exports.Days = Days;
class Week {
    constructor() {
        this.days = new Days();
    }
}
exports.Week = Week;
class MessageSettings {
}
exports.MessageSettings = MessageSettings;
class BuffManagerConfig {
    constructor() {
        this.messageSettings = new MessageSettings();
        this.days = [];
        this.weeks = [];
    }
}
exports.BuffManagerConfig = BuffManagerConfig;
