import { Client as DiscordClient, Collection, GatewayIntentBits } from "discord.js";
export class Client extends DiscordClient {
    _modules;
    _commands;
    _moduleListeners;
    _tasks;
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
        this._commands = new Collection();
        this._tasks = new Collection();
        this._modules = new Collection();
        this._moduleListeners = new Collection();
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
//# sourceMappingURL=client.js.map