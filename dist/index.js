#!/usr/bin/env node
import { program } from "commander";
import { userInfo } from "os";
import "reflect-metadata";
import { main } from "./app.js";
import { ConfigurationService } from "./config/configurationService.js";
import { ApplicationConfiguration, DatabaseConfiguration, LoggerConfigs } from "./config/index.js";
import "./modules/index.js";
console.log(`Welcome ${userInfo().username}.`);
ConfigurationService.RegisterConfiguration("", ApplicationConfiguration);
ConfigurationService.RegisterConfiguration("database", DatabaseConfiguration);
ConfigurationService.RegisterConfiguration("logger", LoggerConfigs);
program.name("discord-bot").description("Discord Bot.").version("0.0.1");
program.command("deploy", { isDefault: true }).description("Runs to bot.").action(main);
program
    .command("register-commands")
    .description("Runs the command register script.")
    .option("-t, --token <string>", "Token for bot.")
    .option("-c, --client <string>", "Client ID.")
    .option("-g, --guild <string>", "Guild ID to register commands for. If this is set configuration file options will be ignored.")
    .option("-u, --unregister", "Use to unregister commands instead.")
    .action(args => {
    console.log(args);
    if (typeof args === "object" && !Array.isArray(args)) {
        console.log(args);
    }
    console.log("Hello World");
});
program.parse();
//# sourceMappingURL=index.js.map