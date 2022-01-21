import {Client as DiscordClient, ClientEvents, ClientOptions, Collection} from "discord.js";
import ConfigManager from "../configManager";
import {Module} from "./Module";
import Command from "./Command";
import Task from "./Task";
import Listener from "./Listener";

class Client extends DiscordClient {
    modules: Collection<string, Module>
    commands: Collection<string, Command>;
    moduleListeners: Collection<Exclude<string | symbol, keyof ClientEvents>, Listener[]>;
    tasks: Collection<string, Task>;
    configs: ConfigManager;

    constructor(args: ClientOptions) {
        super(args);
        this.commands = new Collection<string, Command>();
        this.tasks = new Collection<string, Task>();
        this.modules = new Collection<string, Module>();
        this.configs = new ConfigManager();
        this.moduleListeners = new Collection<Exclude<string | symbol, keyof ClientEvents>, Listener[]>();
    }
}

export default Client;
