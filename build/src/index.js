#!/usr/bin/env node
import "reflect-metadata";
import { program } from "commander";
import { existsSync } from "fs";
import inquirer from "inquirer";
import * as os from "os";
import { botMain } from "./app.js";
import { configPath } from "./config/app_configs/index.js";
import { commandRegistration } from "./config/commandRegistration.js";
import { generateConfigs } from "./config/generator/generateConfiguration.js";
console.log(`Welcome ${os.userInfo().username}.`);
const configCheck = () => !existsSync(configPath) ? inquirer.prompt({
    name: "result",
    message: "I have noticed you do not have the configuration file. Would you like for me to create it?",
    type: "confirm",
}).then(({ result }) => result ? generateConfigs({ minimal: true }) : Promise.resolve()) : Promise.resolve();
program
    .name("discord-bot")
    .description("Discord Bot.")
    .version("0.0.1");
program.command("deploy", { isDefault: true })
    .description("Runs to bot.")
    .action(() => configCheck().then(botMain));
program.command("register-commands")
    .description("Runs the command register script.")
    .option("-t, --token <string>", "Token for bot.")
    .option("-c, --client <string>", "Client ID.")
    .option("-g, --guild <string>", "Guild ID to register commands for. If this is set configuration file options will be ignored.")
    .option("-u, --unregister", "Use to unregister commands instead.")
    .action((args) => configCheck().then(() => commandRegistration(args)));
program.command("configuration")
    .description("Creates/Updates the configuration file.")
    .option("-t, --token <string>", "The token for the bot to use.")
    .option("-l, --logging-level <string>", "Logging level for bot output.")
    .option("-c, --client-id <string>", "Client Id used for command registration.")
    .option("-g, --guild-id <string>", "Guild Id for command registration. Sets register to guild on by default.")
    .option("-r, --register-for-guild", "If you want to register for a guild. Requires guild Id to be set.", false)
    .option("-nr, --no-register-for-guild", "If you want to register for a guild. Requires guild Id to be set.", false)
    .option("-u, --unregister", "If you want to unregister commands instead.")
    .option("-du, --username <string>", "Database username.")
    .option("-dp, --password <string>", "Database password.")
    .option("-dh, --host <string>", "Database host.")
    .option("-dpp, --port <string>", "Database port.")
    .option("-dd, --database-name <string>", "Database database name. (yes it is a confusing name)")
    .option("-dq, --query <string>", "Database query. Format is {[key:string]:any} for each pair.")
    .option("-durl, --url <string>", "Database Url. If set all other options for database is ignored.")
    .option("-ddns, --use-dns", "Database username. If set the Url generated will use DNS.")
    .option("-m, --minimal", "Will create the minimal configuration required for the bot.")
    .option("-n, --new", "Will start a new config file instead of use an existing one.")
    .option("-d, --dev", "Will save a dev version.")
    .action((args) => generateConfigs(args));
program.parse();
//# sourceMappingURL=index.js.map