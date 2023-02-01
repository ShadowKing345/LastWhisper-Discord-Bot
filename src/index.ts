#!/usr/bin/env node
import "reflect-metadata";

import { program } from "commander";
import { userInfo } from "os";
import { ConfigurationService } from "./config/configurationService.js";
import {
  ApplicationConfiguration,
  CommandRegistrationConfiguration,
  CommonConfigurationKeys,
} from "./config/index.js";
import "./modules/index.js";
import { Bot } from "./objects/index.js";
import { manageCommands } from "./slashCommandManager.js";

console.log(`Welcome ${userInfo().username}.`);

ConfigurationService.registerConfiguration<ApplicationConfiguration>(CommonConfigurationKeys.APPLICATION, ApplicationConfiguration);

/**
 * Main function of application.
 * Should be used as starting point for the bot.
 */
async function runBot() {
  process.setMaxListeners(30);
  console.log("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");

  try {
    const bot = new Bot();
    bot.init();
    await bot.run();
  } catch (error) {
    console.error(error instanceof Error ? error.stack : error);
  }
}

/**
 * Function used to register commands.
 * @param args
 */
async function runCommandRegistration(args: Record<string, unknown>) {
  if (!args || typeof args !== "object" || Array.isArray(args)) {
    throw new Error("Args was for some reason null. This is not correct.");
  }

  const config: CommandRegistrationConfiguration = new CommandRegistrationConfiguration();

  if ("client" in args && typeof args.client === "string") {
    config.clientId = args.client;
  }

  if ("guild" in args && typeof args.guild === "string") {
    config.guildId = args.guild;
    config.registerForGuild = true;
  }

  if ("unregister" in args && typeof args.unregister === "boolean") {
    config.unregister = args.unregister;
  }

  return manageCommands("token" in args && typeof args.token === "string" ? args.token : undefined, config);
}

program.name("discord-bot").description("Discord Bot.").version("0.0.1");

program.command("deploy", { isDefault: true }).description("Runs to bot.").action(runBot);

program.command("register-commands")
  .description("Runs the command register script.")
  .option("-t, --token <string>", "Token for bot.")
  .option("-c, --client <string>", "Client ID.")
  .option("-g, --guild <string>", "Guild ID to register commands for. If this is set configuration file options will be ignored.")
  .option("-u, --unregister [boolean]", "Use to unregister commands instead.")
  .action(runCommandRegistration);

program.parse();
