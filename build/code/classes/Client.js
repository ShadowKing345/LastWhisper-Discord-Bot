"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const configManager_1 = __importDefault(require("../configManager"));
class Client extends discord_js_1.Client {
    constructor(args) {
        super(args);
        this.commands = new discord_js_1.Collection();
        this.tasks = new discord_js_1.Collection();
        this.modules = new discord_js_1.Collection();
        this.configs = new configManager_1.default();
        this.moduleListeners = new discord_js_1.Collection();
    }
}
exports.default = Client;
