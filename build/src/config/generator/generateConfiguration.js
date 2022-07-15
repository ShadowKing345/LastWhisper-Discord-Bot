import { existsSync, readFileSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import { container } from "tsyringe";
import { LOGGING_LEVELS } from "../../shared/logger/logger.js";
import { deepMerge } from "../../shared/utils.js";
import { AppConfig, configPath, devConfigPath } from "../app_configs/index.js";
import { inquireBoolean, inquireDictionary, inquireInput, inquireOptions } from "./utils.js";
const levels = Object.keys(LOGGING_LEVELS).filter(level => isNaN(Number(level)));
var Options;
(function (Options) {
    Options[Options["TOKEN"] = 1] = "TOKEN";
    Options[Options["LOGGING_LEVEL"] = 2] = "LOGGING_LEVEL";
    Options[Options["CLIENT_ID"] = 3] = "CLIENT_ID";
    Options[Options["GUILD_ID"] = 4] = "GUILD_ID";
    Options[Options["REGISTER_FOR_GUILD"] = 5] = "REGISTER_FOR_GUILD";
    Options[Options["UNREGISTER"] = 6] = "UNREGISTER";
    Options[Options["USERNAME"] = 7] = "USERNAME";
    Options[Options["PASSWORD"] = 8] = "PASSWORD";
    Options[Options["HOST"] = 9] = "HOST";
    Options[Options["PORT"] = 10] = "PORT";
    Options[Options["DATABASE_NAME"] = 11] = "DATABASE_NAME";
    Options[Options["QUERY"] = 12] = "QUERY";
    Options[Options["URL"] = 13] = "URL";
    Options[Options["USE_DNS"] = 14] = "USE_DNS";
    Options[Options["SAVE"] = 0] = "SAVE";
    Options[Options["EXIT"] = -1] = "EXIT";
    Options[Options["DATABASE"] = -2] = "DATABASE";
    Options[Options["COMMAND"] = -3] = "COMMAND";
})(Options || (Options = {}));
const defaultOptions = [
    {
        type: "separator",
    },
    {
        name: "Save & Quit",
        value: Options.SAVE,
    },
    {
        name: "Exit",
        value: Options.EXIT,
    },
    {
        type: "separator",
    },
];
async function minimal(config) {
    console.log("Welcome to minimal configuration.\nYou will only be able to configure a select number of fields.");
    for (;;) {
        const { action } = await inquirer.prompt([
            {
                name: "action",
                message: "Configuration",
                type: "list",
                choices: [
                    {
                        name: `Token [${config.token}]`,
                        value: Options.TOKEN,
                    },
                    {
                        name: `Client ID [${config.commandRegistration.clientId}]`,
                        value: Options.CLIENT_ID,
                    },
                    {
                        name: `Database URL [${config.database.url}]`,
                        value: Options.URL,
                    },
                    ...defaultOptions,
                ],
            },
        ]);
        let result;
        switch (action) {
            case Options.TOKEN:
                result = await inquireInput("New token to be used.");
                if (result)
                    config.token = result;
                break;
            case Options.CLIENT_ID:
                result = await inquireInput("New client ID to be used.");
                if (result)
                    config.commandRegistration.clientId = result;
                break;
            case Options.URL:
                result = await inquireInput("New database URL to be used.");
                if (result)
                    config.database.url = result;
                break;
            case Options.SAVE:
                return true;
            case Options.EXIT:
                return false;
            default:
                break;
        }
    }
}
async function command({ commandRegistration }) {
    for (;;) {
        const { action } = await inquirer.prompt([
            {
                name: "action",
                message: "Command Registration Configuration. Select what you wish to configure.",
                type: "list",
                choices: [
                    {
                        name: `Client ID [${commandRegistration.clientId}]`,
                        value: Options.CLIENT_ID,
                    },
                    {
                        name: `Guild ID [${commandRegistration.guildId}]`,
                        value: Options.GUILD_ID,
                    },
                    {
                        name: `Register for guild [${commandRegistration.registerForGuild}]`,
                        value: Options.REGISTER_FOR_GUILD,
                    },
                    {
                        name: `Unregister Commands [${commandRegistration.unregister}]`,
                        value: Options.UNREGISTER,
                    },
                    {
                        type: "separator",
                    },
                    {
                        name: "Back",
                        value: Options.EXIT,
                    },
                    {
                        type: "separator",
                    },
                ],
            }
        ]);
        let result;
        switch (action) {
            case Options.CLIENT_ID:
                result = await inquireInput("New Client ID to be used.");
                if (result)
                    commandRegistration.clientId = result;
                break;
            case Options.GUILD_ID:
                result = await inquireInput("New Guild ID to be used.");
                if (result)
                    commandRegistration.guildId = result;
                break;
            case Options.REGISTER_FOR_GUILD:
                result = await inquireBoolean("Should register for guild?");
                if (result !== null)
                    commandRegistration.registerForGuild = result;
                break;
            case Options.UNREGISTER:
                result = await inquireBoolean("Should unregister commands?");
                if (result !== null)
                    commandRegistration.unregister = result;
                break;
            case Options.EXIT:
                return;
            default:
                break;
        }
    }
}
async function database({ database }) {
    for (;;) {
        const { action } = await inquirer.prompt([
            {
                name: "action",
                message: "Database Configuration. Select what you wish to configure.",
                type: "list",
                choices: [
                    {
                        name: `Username [${database.username}]`,
                        value: Options.USERNAME,
                    },
                    {
                        name: `Password [${database.password}]`,
                        value: Options.PASSWORD,
                    },
                    {
                        name: `Host [${database.host}]`,
                        value: Options.HOST,
                    },
                    {
                        name: `Port [${database.port}]`,
                        value: Options.PORT,
                    },
                    {
                        name: `Database Name [${database.database}]`,
                        value: Options.DATABASE_NAME,
                    },
                    {
                        name: `Query [${JSON.stringify(database.query)}]`,
                        value: Options.QUERY,
                    },
                    {
                        name: `URL [${database.url}]`,
                        value: Options.URL,
                    },
                    {
                        name: `Use DNS [${database.useDns}]`,
                        value: Options.USE_DNS,
                    },
                    {
                        type: "separator",
                    },
                    {
                        name: "Back",
                        value: Options.EXIT,
                    },
                    {
                        type: "separator",
                    },
                ],
            }
        ]);
        let result;
        switch (action) {
            case Options.USERNAME:
                result = await inquireInput("New username to be used.");
                if (result)
                    database.username = result;
                break;
            case Options.PASSWORD:
                result = await inquireInput("New password to be used.");
                if (result)
                    database.password = result;
                break;
            case Options.HOST:
                result = await inquireInput("New host to be used.");
                if (result)
                    database.host = result;
                break;
            case Options.PORT:
                result = await inquireInput("New port to be used.");
                if (result)
                    database.port = result;
                break;
            case Options.DATABASE_NAME:
                result = await inquireInput("New database name to be used.");
                if (result)
                    database.database = result;
                break;
            case Options.QUERY:
                result = await inquireDictionary(database.query);
                if (result)
                    database.query = result;
                break;
            case Options.URL:
                result = await inquireInput("New URL to be used.");
                if (result)
                    database.url = result;
                break;
            case Options.USE_DNS:
                result = await inquireBoolean("Should use DNS?");
                if (result)
                    database.useDns = result;
                break;
            case Options.EXIT:
                return;
            default:
                break;
        }
    }
}
async function full(config) {
    console.log("Welcome to full configuration.\nYou will have access to all configurations available.");
    for (;;) {
        const { action } = await inquirer.prompt([
            {
                name: "action",
                message: "Full Configuration. Select what you wish to configure.",
                type: "list",
                choices: [
                    {
                        name: `Token [${config.token}]`,
                        value: Options.TOKEN,
                    },
                    {
                        name: `Logging Level [${config.logging_level}]`,
                        value: Options.LOGGING_LEVEL,
                    },
                    {
                        name: "Command Configuration",
                        value: Options.COMMAND,
                    },
                    {
                        name: "Database Configuration",
                        value: Options.DATABASE,
                    },
                    ...defaultOptions,
                ],
            },
        ]);
        let result;
        switch (action) {
            case Options.TOKEN:
                result = await inquireInput("New token to be used.");
                if (result)
                    config.token = result;
                break;
            case Options.LOGGING_LEVEL:
                result = await inquireOptions("New logging level to be used.", levels);
                if (result >= 0)
                    config.logging_level = levels[result];
                break;
            case Options.DATABASE:
                await database(config);
                break;
            case Options.COMMAND:
                await command(config);
                break;
            case Options.SAVE:
                return true;
            case Options.EXIT:
                return false;
            default:
                break;
        }
    }
}
export async function generateConfigs(args) {
    console.log("Welcome again to the configuration tool provided by the bot.");
    console.log(`Current configuration method is set do ${args.dev ? "Development" : "Production"}`);
    const path = args.dev ? devConfigPath : configPath;
    const config = container.resolve(AppConfig);
    const newConfig = !args.new && existsSync(path);
    console.log(newConfig ? "New configuration will be created." : "An existing configuration has been found and will be used overwritten.");
    if (newConfig)
        deepMerge(config, JSON.parse(readFileSync(path, "utf-8")));
    if (args.token)
        config.token = args.token;
    if (args.loggingLevel)
        config.logging_level = args.loggingLevel;
    if (args.clientId)
        config.commandRegistration.clientId = args.clientId;
    if (args.guildId)
        config.commandRegistration.guildId = args.guildId;
    if (args.registerForGuild)
        config.commandRegistration.registerForGuild = args.registerForGuild;
    if (args.unregister)
        config.commandRegistration.unregister = args.unregister;
    if (args.username)
        config.database.username = args.username;
    if (args.password)
        config.database.password = args.password;
    if (args.host)
        config.database.host = args.host;
    if (args.port)
        config.database.port = args.port;
    if (args.databaseName)
        config.database.database = args.databaseName;
    if (args.query)
        config.database.query = JSON.parse(args.query);
    if (args.url)
        config.database.url = args.url;
    if (args.useDns)
        config.database.useDns = args.useDns;
    const saveFlag = await (args.minimal ? minimal(config) : full(config));
    console.log(`Config will ${saveFlag ? "" : "not"} be saved.`);
    if (saveFlag) {
        writeFileSync(path, JSON.stringify(config, null, 4));
    }
}
//# sourceMappingURL=generateConfiguration.js.map