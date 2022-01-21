"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class ConfigManager {
    constructor() {
        this.db_Url = process.env.DB_URL;
    }
    async loadConfigs() {
        if (!this.db_Url)
            return;
        try {
            await mongoose_1.default.connect(this.db_Url);
            console.log("Connected To DB");
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.default = ConfigManager;
