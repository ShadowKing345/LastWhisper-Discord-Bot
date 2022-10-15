import { Client as DiscordClient, ClientEvents, Collection, GatewayIntentBits } from "discord.js";

import { ChatCommand } from "./chatCommand.js";
import { Listener } from "./listener.js";
import { ModuleBase } from "../objects/moduleBase.js";
import { Task } from "./task.js";

export class Client extends DiscordClient {
    private readonly _modules: Collection<string, ModuleBase>;
    private readonly _commands: Collection<string, ChatCommand>;
    private readonly _moduleListeners: Collection<keyof ClientEvents, Listener[]>;
    private readonly _tasks: Collection<string, Task>;

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

        this._commands = new Collection<string, ChatCommand>();
        this._tasks = new Collection<string, Task>();
        this._modules = new Collection<string, ModuleBase>();
        this._moduleListeners = new Collection<keyof ClientEvents, Listener[]>();
    }

    get modules(): Collection<string, ModuleBase> {
        return this._modules;
    }

    get commands(): Collection<string, ChatCommand> {
        return this._commands;
    }

    get moduleListeners(): Collection<keyof ClientEvents, Listener[]> {
        return this._moduleListeners;
    }

    get tasks(): Collection<string, Task> {
        return this._tasks;
    }
}
