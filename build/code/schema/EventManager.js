"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    _id: String,
    listenerChannelId: { type: String, default: "" },
    postingChannelId: { type: String, default: "" },
    delimiterCharacters: {
        type: Array,
        default: ["\\[", "\\]"]
    },
    tags: Object,
    dateTimeFormat: Array,
    events: Array,
    reminders: Array
});
exports.default = mongoose_1.default.model("EventManager", schema);
