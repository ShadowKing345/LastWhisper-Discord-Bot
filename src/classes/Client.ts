import {Client as DiscordClient, ClientOptions, Collection} from "discord.js";
import ConfigManager from "../config-manager";
import {Module} from "./Module";
import Command from "./Command";
import Task from "./Task";

class Client extends DiscordClient {
    modules: Collection<string, Module>
    commands: Collection<string, Command>;
    tasks: Collection<string, Task>;
    configs: ConfigManager;

    constructor(args: ClientOptions) {
        super(args);
        this.commands = new Collection<string, Command>();
        this.tasks = new Collection<string, Task>();
        this.modules = new Collection<string, Module>();
        this.configs = new ConfigManager();
    }
}

export default Client;
