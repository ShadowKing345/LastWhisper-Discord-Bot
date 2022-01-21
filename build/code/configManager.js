"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class ConfigManager {
    static async establishDBConnection(appConfigs) {
        if (!appConfigs.getDBUrl)
            throw new Error("No DB URL set!");
        console.log("Connecting to DB");
        await mongoose_1.default.connect(appConfigs.getDBUrl);
        console.log("Successfully Connected to DB");
    }
}
exports.default = ConfigManager;
