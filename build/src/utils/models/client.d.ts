import { Client as DiscordClient, ClientEvents, Collection, ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { EventListener } from "./eventListener.js";
import { ModuleBase } from "../objects/moduleBase.js";
import { Task } from "./task.js";
import { CommandBuilder } from "../objects/commandBuilder.js";
/**
 * Custom client class to hold the additional information about a discord client.
 */
export declare class Client extends DiscordClient {
    private readonly _modules;
    private readonly _commands;
    private readonly _moduleListeners;
    private readonly _tasks;
    private readonly _buttons;
    private readonly _selectMenus;
    private readonly _modalSubmits;
    constructor();
    get modules(): Collection<string, ModuleBase>;
    get commands(): Collection<string, CommandBuilder>;
    get moduleListeners(): Collection<keyof ClientEvents, EventListener[]>;
    get tasks(): Collection<string, Task>;
    get buttons(): Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>>;
    get selectMenus(): Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>>;
    get modalSubmits(): Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>>;
}
//# sourceMappingURL=client.d.ts.map