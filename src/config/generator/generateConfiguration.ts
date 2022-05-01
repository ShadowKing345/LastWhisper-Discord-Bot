import { existsSync, readFileSync } from "fs";
import inquirer from "inquirer";

import { AppConfigs, configPath, devConfigPath } from "../appConfigs.js";

type GenerateConfigsArgs = {
    token?: string,
    loggingLevel?: string,
    clientId?: string,
    guildId?: string,
    registerForGuild?: boolean,
    unregister?: boolean,
    username?: string,
    password?: string,
    databaseName?: string,
    query?: string,
    url?: string,
    useDns?: boolean,
    full?: boolean,
    new?: boolean,
    dev?: boolean,
};

const defaultOptions = [
    {
        type: "separator",
    },
    {
        name: "Save & Quit",
        value: 0,
    },
    {
        name: "Exit",
        value: -1,
    },
];

async function minimal(config: AppConfigs): Promise<void> {
    // Todo: Remove
    config.database.database = "";

    for (; ;) {
        const { action } = await inquirer.prompt<{ action: number }>([
            {
                name: "action",
                message: "Configuration",
                type: "list",
                choices: [
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Client ID",
                        value: 2,
                    },
                    {
                        name: "Database URL",
                        value: 3,
                    },
                    ...defaultOptions,
                ],
            },
        ]);

        if (action <= 0) {
            return;
        }
    }
}

async function full(config: AppConfigs): Promise<void> {
    // Todo: Remove
    config.database.database = "";

    for (; ;) {
        const { action } = await inquirer.prompt<{ action: number }>([
            {
                name: "action",
                message: "Configuration",
                type: "list",
                choices: [
                    {
                        name: "Token",
                        value: 1,
                    },                    {
                        name: "Dropdown",
                        type: "dropdown",
                        choices: [
                            {
                                name: "Fish",
                                value: 3,
                            }
                        ]
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    {
                        name: "Token",
                        value: 1,
                    },
                    ...defaultOptions,
                ],
            },
        ]);

        if (action <= 0) {
            return;
        }
    }
}

export async function generateConfigs(args: GenerateConfigsArgs): Promise<void> {
    const path = args.dev ? devConfigPath : configPath;

    const config = new AppConfigs();
    if (!args.new && existsSync(path)) {
        Object.assign(config, JSON.parse(readFileSync(path, "utf-8")));
    }

    if (args.token) config.token = args.token;
    if (args.loggingLevel) config.logging_level = args.loggingLevel;
    if (args.clientId) config.commandRegistration.clientId = args.clientId;
    if (args.guildId) config.commandRegistration.guildId = args.guildId;
    if (args.registerForGuild) config.commandRegistration.registerForGuild = args.registerForGuild;
    if (args.unregister) config.commandRegistration.unregister = args.unregister;
    if (args.username) config.database.username = args.username;
    if (args.password) config.database.password = args.password;
    if (args.databaseName) config.database.database = args.databaseName;
    if (args.query) config.database.query = JSON.parse(args.query);
    if (args.url) config.database.url = args.url;
    if (args.useDns) config.database.useDns = args.useDns;

    if (args.full) await full(config); else await minimal(config);
}
