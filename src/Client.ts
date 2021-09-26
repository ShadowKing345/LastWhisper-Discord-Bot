import { Client as DiscordClient, ClientOptions, Collection } from "discord.js";
import ConfigManager from "./config-manager";
import { Command } from "./commands";
import { Task } from "./tasks";

class Client extends DiscordClient {
  commands: Collection<string, Command>;
  tasks: Collection<string, Task>;
  configs: ConfigManager;
  constructor(args: ClientOptions) {
    super(args);
    this.commands = new Collection();
    this.tasks = new Collection();

    this.configs = new ConfigManager();
  }
}

export default Client;
