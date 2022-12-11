#!/usr/bin/env node
import "reflect-metadata";
import "./modules/index.js";
import { program } from "commander";
import { userInfo } from "os";
import { main } from "./app.js";
import { commandRegistration } from "./commandRegistration.js";
import { ConfigurationService } from "./config/configurationService.js";
import { DatabaseConfiguration, ProjectConfiguration } from "./utils/objects/index.js";
console.log(`Welcome ${userInfo().username}.`);
ConfigurationService.RegisterConfiguration("", ProjectConfiguration);
ConfigurationService.RegisterConfiguration("database", DatabaseConfiguration);
program.name("discord-bot").description("Discord Bot.").version("0.0.1");
program.command("deploy", { isDefault: true }).description("Runs to bot.").action(main);
program
    .command("register-commands")
    .description("Runs the command register script.")
    .option("-t, --token <string>", "Token for bot.")
    .option("-c, --client <string>", "Client ID.")
    .option("-g, --guild <string>", "Guild ID to register commands for. If this is set configuration file options will be ignored.")
    .option("-u, --unregister", "Use to unregister commands instead.")
    .action(args => commandRegistration(args));
program.parse();
//# sourceMappingURL=index.js.map