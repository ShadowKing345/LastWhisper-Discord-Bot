import { Client as DiscordClient, Collection, GatewayIntentBits } from "discord.js";
/**
 * Custom client class to hold the additional information about a discord client.
 */
export class Client extends DiscordClient {
    _modules = new Collection();
    _commands = new Collection();
    _moduleListeners = new Collection();
    _tasks = new Collection();
    _buttons = new Collection();
    _selectMenus = new Collection();
    _modalSubmits = new Collection();
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
            ],
        });
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
    get buttons() {
        return this._buttons;
    }
    get selectMenus() {
        return this._selectMenus;
    }
    get modalSubmits() {
        return this._modalSubmits;
    }
}
//# sourceMappingURL=client.js.map