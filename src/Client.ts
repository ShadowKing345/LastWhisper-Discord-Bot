import { Client as DiscordClient, ClientOptions, Collection } from "discord.js";
import ConfigManager from "./config-manager";
import { Command } from "./commands";

class Client extends DiscordClient {
  commands: Collection<string, Command>;
  tasks: Collection<string, NodeJS.Timer>;
  configs: ConfigManager;
  constructor(args: ClientOptions, configRelativePath: string) {
    super(args);
    this.commands = new Collection();
    this.tasks = new Collection();

    this.configs = new ConfigManager(configRelativePath);
    this.configs.loadConfigs();
  }
}

export default Client;
