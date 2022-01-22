"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConfigs = exports.AppConfigs = exports.CONFIGS = void 0;
const fs_1 = __importDefault(require("fs"));
exports.CONFIGS = null;
class Settings {
}
class AppConfigs {
}
exports.AppConfigs = AppConfigs;
function initConfigs() {
    const rawData = fs_1.default.readFileSync("./appConfigs.json", "utf8");
    const settings = Object.assign(new Settings, JSON.parse(rawData));
    exports.CONFIGS = Object.assign(new AppConfigs, settings.production, settings.development);
    return exports.CONFIGS;
}
exports.initConfigs = initConfigs;
