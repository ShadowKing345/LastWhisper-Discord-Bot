import { Client as DiscordClient, ClientEvents, Collection, GatewayIntentBits, ChatInputCommandInteraction, InteractionResponse } from "discord.js";

import { EventListener } from "./eventListener.js";
import { ModuleBase } from "../objects/moduleBase.js";
import { Task } from "./task.js";
import { CommandBuilder } from "../objects/commandBuilder.js";

/**
 * Custom client class to hold the additional information about a discord client.
 */
export class Client extends DiscordClient {
    private readonly _modules: Collection<string, ModuleBase> = new Collection<string, ModuleBase>();
    private readonly _commands: Collection<string, CommandBuilder> = new Collection<string, CommandBuilder>();
    private readonly _moduleListeners: Collection<keyof ClientEvents, EventListener[]> = new Collection<keyof ClientEvents, EventListener[]>();
    private readonly _tasks: Collection<string, Task> = new Collection<string, Task>();

    private readonly _buttons: Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>> = new Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>>();
    private readonly _selectMenus: Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>> = new Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>>();
    private readonly _modalSubmits: Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>> = new Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>>();

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

    get modules(): Collection<string, ModuleBase> {
        return this._modules;
    }

    get commands(): Collection<string, CommandBuilder> {
        return this._commands;
    }

    get moduleListeners(): Collection<keyof ClientEvents, EventListener[]> {
        return this._moduleListeners;
    }

    get tasks(): Collection<string, Task> {
        return this._tasks;
    }

    public get buttons(): Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>> {
        return this._buttons;
    }

    public get selectMenus(): Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>> {
        return this._selectMenus;
    }

    public get modalSubmits(): Collection<string, (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>> {
        return this._modalSubmits;
    }
}
