"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigs = exports.AppConfigs = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Settings {
}
class AppConfigs {
    get getToken() {
        return this.token;
    }
    ;
    get getClientId() {
        return this.clientId;
    }
    get getDBUrl() {
        return this.dbUrl;
    }
    get getGuildId() {
        return this.guildId;
    }
}
exports.AppConfigs = AppConfigs;
function getConfigs() {
    const rawData = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../../resources/appConfigs.json"), "utf8");
    const settings = Object.assign(new Settings, JSON.parse(rawData));
    return settings.isDev ? Object.assign(new AppConfigs, settings.production, settings.development) : Object.assign(new AppConfigs, settings.production);
}
exports.getConfigs = getConfigs;
