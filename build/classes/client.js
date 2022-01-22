"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const discord_js_1 = require("discord.js");
class Client extends discord_js_1.Client {
    constructor() {
        super({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.Intents.FLAGS.GUILD_BANS, discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
        this._commands = new discord_js_1.Collection();
        this._tasks = new discord_js_1.Collection();
        this._modules = new discord_js_1.Collection();
        this._moduleListeners = new discord_js_1.Collection();
    }
    get modules() {
        return this._modules;
    }
    get commands() {
        return this._commands;
    }
    get moduleListeners() {
        return this._moduleListeners;
    }
    get tasks() {
        return this._tasks;
    }
}
exports.Client = Client;
