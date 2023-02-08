#!/usr/bin/env node
import "reflect-metadata";
import { program } from "commander";
import { userInfo } from "os";
import { ConfigurationService } from "./config/configurationService.js";
import { ApplicationConfiguration, CommandRegistrationConfiguration, CommonConfigurationKeys, Logger, } from "./config/index.js";
import "./modules/index.js";
import { Bot } from "./objects/index.js";
import { manageCommands } from "./slashCommandManager.js";
const logger = new Logger("InitScript");
logger.info(`Welcome ${userInfo().username}.`);
ConfigurationService.registerConfiguration(CommonConfigurationKeys.APPLICATION, ApplicationConfiguration);
function exit(bot) {
    bot.stop().then(null, error => console.error(error));
}
async function runBot() {
    process.setMaxListeners(30);
    logger.info("Welcome again to the main bot application.\nWe are currently setting up some things so sit tight and we will begin soon.");
    try {
        const bot = new Bot();
        await bot.init();
        await bot.run();
        process.on("exit", () => exit(bot));
        process.on("SIGINT", () => exit(bot));
        process.on("SIGTERM", () => exit(bot));
    }
    catch (error) {
        logger.error(error instanceof Error ? error.stack : error);
    }
}
async function runCommandRegistration(args) {
    if (!args || typeof args !== "object" || Array.isArray(args)) {
        throw new Error("Args was for some reason null. This is not correct.");
    }
    const config = new CommandRegistrationConfiguration();
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
//# sourceMappingURL=index.js.map