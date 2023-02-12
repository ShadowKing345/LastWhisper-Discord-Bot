#!/usr/bin/env node
import "reflect-metadata";

import { program } from "commander";
import { userInfo } from "os";
import { ConfigurationService } from "./config/configurationService.js";
import { ApplicationConfiguration, CommandRegistrationConfiguration, CommonConfigurationKeys, Logger } from "./config/index.js";
import "./modules/index.js";
import { Bot } from "./objects/index.js";
import { manageCommands } from "./slashCommandManager.js";
import { Commander } from "./decorators/index.js";

class Index {
  private static readonly logger = new Logger("InitScript");

  constructor() {
    program.name("discord-bot").description("Discord Bot.");
  }

  /**
   * Main function of application.
   * Should be used as starting point for the bot.
   */
  @Commander.addCommand({
    name: "deploy",
    description: "Runs to bot.",
  })
  public async runBot() {
    process.setMaxListeners(30);
    Index.logger.info("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");

    try {
      const bot = new Bot();
      await bot.init();
      await bot.run();

      process.on("exit", () => this.exit(bot));
      process.on("SIGINT", () => this.exit(bot));
      process.on("SIGTERM", () => this.exit(bot));
    } catch (error) {
      Index.logger.error(error instanceof Error ? error.stack : error);
    }
  }

  /**
   * Function used to register commands.
   * @param args
   */
  @Commander.addCommand({
    name: "commandManager",
    description: "Handles the various tasks relation providing slash commands to Discord.",
    options: [
      { definition: "-t, --token <string>", description: "Token for bot." },
      { definition: "-c, --client <string>", description: "Client ID." },
      {
        definition: "-g, --guild <string>",
        description: "Guild ID to register commands for. If this is set configuration file options will be ignored.",
      },
      { definition: "-u, --unregister [boolean]", description: "Use to unregister commands instead." },
    ],
  })
  public async runCommandManager(args: Record<string, unknown>) {
    if(!args || typeof args !== "object" || Array.isArray(args)) {
      throw new Error("Args was for some reason null. This is not correct.");
    }

    const config: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();

    if("client" in args && typeof args.client === "string") {
      config.clientId = args.client;
    }

    if("guild" in args && typeof args.guild === "string") {
      config.guildId = args.guild;
      config.registerForGuild = true;
    }

    if("unregister" in args && typeof args.unregister === "boolean") {
      config.unregister = args.unregister;
    }

    return manageCommands("token" in args && typeof args.token === "string" ? args.token : undefined, config);
  }

  private exit(bot: Bot): void {
    bot.stop().then(null, error => console.error(error));
  }

  @Commander.hook("preAction")
  public preInit() {
    Index.logger.info(`Welcome ${userInfo().username}.`);
    ConfigurationService.registerConfiguration<ApplicationConfiguration>(CommonConfigurationKeys.APPLICATION, ApplicationConfiguration);
  }

  public parse() {
    program.parse();
  }
}

const index = new Index();
index.parse();