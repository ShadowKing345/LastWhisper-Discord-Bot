import { Client as DiscordClient, ClientEvents, Collection, GatewayIntentBits } from "discord.js";

import { ChatInputCommand } from "./chatInputCommand.js";
import { EventListener } from "./eventListener.js";
import { ModuleBase } from "../objects/moduleBase.js";
import { Task } from "./task.js";

export class Client extends DiscordClient {
    private readonly _modules: Collection<string, ModuleBase>;
    private readonly _commands: Collection<string, ChatInputCommand>;
    private readonly _moduleListeners: Collection<keyof ClientEvents, EventListener[]>;
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

        this._commands = new Collection<string, ChatInputCommand>();
        this._tasks = new Collection<string, Task>();
        this._modules = new Collection<string, ModuleBase>();
        this._moduleListeners = new Collection<keyof ClientEvents, EventListener[]>();
    }

    get modules(): Collection<string, ModuleBase> {
        return this._modules;
    }

    get commands(): Collection<string, ChatInputCommand> {
        return this._commands;
    }

    get moduleListeners(): Collection<keyof ClientEvents, EventListener[]> {
        return this._moduleListeners;
    }

    get tasks(): Collection<string, Task> {
        return this._tasks;
    }
}
