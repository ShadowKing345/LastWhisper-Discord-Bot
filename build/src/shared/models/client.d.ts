import { Client as DiscordClient, ClientEvents, Collection } from "discord.js";
import { Command } from "./command.js";
import { Listener } from "./listener.js";
import { ModuleBase } from "./moduleBase.js";
import { Task } from "./task.js";
export declare class Client extends DiscordClient {
    private readonly _modules;
    private readonly _commands;
    private readonly _moduleListeners;
    private readonly _tasks;
    constructor();
    get modules(): Collection<string, ModuleBase>;
    get commands(): Collection<string, Command>;
    get moduleListeners(): Collection<keyof ClientEvents, Listener[]>;
    get tasks(): Collection<string, Task>;
}
//# sourceMappingURL=client.d.ts.map