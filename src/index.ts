#!/usr/bin/env node
import "reflect-metadata";
import "./modules/index.js";

import { program } from "commander";
import { userInfo } from "os";

import { main } from "./app.js";
import { commandRegistration } from "./commandRegistration.js";
import { generateConfigObject } from "./utils/config/appConfigs.js";

console.log(`Welcome ${userInfo().username}.`);

generateConfigObject();

// const configCheck = () => !existsSync(configPath) ? inquirer.prompt<{ result: boolean }>({
//     name: "result",
//     message: "I have noticed you do not have the configuration file. Would you like for me to create it?",
//     type: "confirm",
// }).then(({ result }) => result ? generateConfigs({ minimal: true }) : Promise.resolve()) : Promise.resolve();

program.name("discord-bot").description("Discord Bot.").version("0.0.1");

program
  .command("deploy", { isDefault: true })
  .description("Runs to bot.")
  .action(main);

program
  .command("register-commands")
  .description("Runs the command register script.")
  .option("-t, --token <string>", "Token for bot.")
  .option("-c, --client <string>", "Client ID.")
  .option(
    "-g, --guild <string>",
    "Guild ID to register commands for. If this is set configuration file options will be ignored."
  )
  .option("-u, --unregister", "Use to unregister commands instead.")
  .action((args) => commandRegistration(args as unknown));

program.parse();
