import { Client as DiscordClient, Collection, Intents } from "discord.js";
export class Client extends DiscordClient {
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS
            ]
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