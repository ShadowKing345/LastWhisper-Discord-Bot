"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BuffManager_1 = require("../objects/BuffManager");
const schema = new mongoose_1.default.Schema({
    _id: String,
    messageSettings: {
        type: Object,
        default: new BuffManager_1.MessageSettings
    },
    days: Array,
    weeks: Array
});
exports.default = mongoose_1.default.model("BuffManager", schema);
