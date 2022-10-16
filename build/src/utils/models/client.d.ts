import { Client as DiscordClient, ClientEvents, Collection } from "discord.js";
import { EventListener } from "./eventListener.js";
import { ModuleBase } from "../objects/moduleBase.js";
import { Task } from "./task.js";
import { CommandBuilder } from "../objects/commandBuilder.js";
export declare class Client extends DiscordClient {
    private readonly _modules;
    private readonly _commands;
    private readonly _moduleListeners;
    private readonly _tasks;
    constructor();
    get modules(): Collection<string, ModuleBase>;
    get commands(): Collection<string, CommandBuilder>;
    get moduleListeners(): Collection<keyof ClientEvents, EventListener[]>;
    get tasks(): Collection<string, Task>;
}
//# sourceMappingURL=client.d.ts.map