import * as fs from "fs";
import {
    AppConfigs,
    CommandRegistrationConfiguration,
    configPath,
    DatabaseConfiguration,
    devConfigPath,
    parseConfigFile
} from "./appConfigs";
import path from "path";
import inquirer from "inquirer";

enum DEFAULT_ACTIONS {
    FINISH = -1,
    QUIT = -2,
}

const defaultEndChoices = [
    {type: "separator"},
    {name: "Finish.", value: DEFAULT_ACTIONS.FINISH},
    {name: "Return without saving.", value: DEFAULT_ACTIONS.QUIT},
]

async function queryParameters(query: { [key: string]: object }): Promise<{ [key: string]: object }> {
    const copy = Object.assign({}, query ?? {});

    while (true) switch ((await inquirer.prompt<{ action: DEFAULT_ACTIONS }>([{
        type: "list",
        name: "action",
        choices: [...defaultEndChoices],
    }])).action) {
        case DEFAULT_ACTIONS.FINISH:
            return copy;
        case DEFAULT_ACTIONS.QUIT:
            return query;
    }
}

enum DATABASE_ACTIONS {
    USERNAME,
    PASSWORD,
    HOST,
    PORT,
    DATABASE,
    QUERY,
    URL,
    DNS
}

function generateDatabaseChoices(config: DatabaseConfiguration) {
    return [
        {name: `Set username. (Current: ${config.username})`, value: DATABASE_ACTIONS.USERNAME},
        {name: `Set password. (Current: ${config.password})`, value: DATABASE_ACTIONS.PASSWORD},
        {name: `Set host. (Current: ${config.host})`, value: DATABASE_ACTIONS.HOST},
        {name: `Set port. (Current: ${config.port})`, value: DATABASE_ACTIONS.PORT},
        {name: `Set database. (Current: ${config.database})`, value: DATABASE_ACTIONS.DATABASE},
        {name: `Set query parameters. (Current: ${JSON.stringify(config.query)})`, value: DATABASE_ACTIONS.QUERY},
        {name: `Use DNS? (Current: ${config.useDns})`, value: DATABASE_ACTIONS.DNS},
        {name: `Set Url. (Current: ${config.url})`, value: DATABASE_ACTIONS.URL},
        ...defaultEndChoices,
    ];
}

async function databaseConfiguration(databaseConfig: DatabaseConfiguration): Promise<DatabaseConfiguration> {
    const copy = Object.assign({}, databaseConfig ?? new DatabaseConfiguration());

    while (true) switch ((await inquirer.prompt<{ action: DATABASE_ACTIONS & DEFAULT_ACTIONS }>([{
        type: "list",
        name: "action",
        message: "Kindly select option to change.",
        choices: generateDatabaseChoices(copy)
    }])).action) {
        case DATABASE_ACTIONS.USERNAME:
            copy.username = (await inquirer.prompt<{ answer: string }>([{
                type: "input",
                name: "answer",
                message: "Enter username:"
            }])).answer;
            break;
        case DATABASE_ACTIONS.PASSWORD:
            copy.password = (await inquirer.prompt<{ answer: string }>([{
                type: "input",
                name: "answer",
                message: "Enter password:"
            }])).answer;
            break;
        case DATABASE_ACTIONS.HOST:
            copy.host = (await inquirer.prompt<{ answer: string }>([{
                type: "input",
                name: "answer",
                message: "Enter host:"
            }])).answer;
            break;
        case DATABASE_ACTIONS.PORT:
            copy.port = (await inquirer.prompt<{ answer: string }>([{
                type: "input",
                name: "answer",
                message: "Enter port:"
            }])).answer;
            break;
        case DATABASE_ACTIONS.DATABASE:
            copy.database = (await inquirer.prompt<{ answer: string }>([{
                type: "input",
                name: "answer",
                message: "Enter database:"
            }])).answer;
            break;
        case DATABASE_ACTIONS.QUERY:
            copy.query = await queryParameters(copy.query);
            break;
        case DATABASE_ACTIONS.DNS:
            copy.useDns = !copy.useDns;
            break;
        case DATABASE_ACTIONS.URL:
            copy.url = (await inquirer.prompt<{ answer: string }>([{
                type: "input",
                name: "answer",
                message: "Enter URL:"
            }])).answer;
            break;
        case DEFAULT_ACTIONS.FINISH:
            return copy;
        case DEFAULT_ACTIONS.QUIT:
            return databaseConfig;
        default:
            break;
    }
}

async function registrationConfiguration(registrationConfiguration: CommandRegistrationConfiguration): Promise<CommandRegistrationConfiguration> {
    const copy = Object.assign({}, registrationConfiguration ?? new CommandRegistrationConfiguration());

    while (true) switch ((await inquirer.prompt<{ action: DEFAULT_ACTIONS }>([{
        type: "list",
        name: "action",
        choices: [...defaultEndChoices],
    }])).action) {
        case DEFAULT_ACTIONS.FINISH:
            return copy;
        case DEFAULT_ACTIONS.QUIT:
            return registrationConfiguration;
    }

}

enum CREATE_CONFIGURATION_ACTIONS {
    QUIT = -2,
    FINISH = -1,
    DEV,
    TOKEN,
    LOGGING,
    DATABASE,
    REGISTRATION,
}

function generateCreateConfigurationChoices(devFile: boolean, token: string, logging_level: string) {
    return [
        {name: `Set token. (Current: ${token})`, value: CREATE_CONFIGURATION_ACTIONS.TOKEN},
        {name: `Switch logging level. (Current: ${logging_level})`, value: CREATE_CONFIGURATION_ACTIONS.LOGGING},
        {name: `Database configuration.`, value: CREATE_CONFIGURATION_ACTIONS.DATABASE},
        {name: `Command registration configuration.`, value: CREATE_CONFIGURATION_ACTIONS.REGISTRATION},
        {name: `Save as dev file. (Current: ${devFile})`, value: CREATE_CONFIGURATION_ACTIONS.DEV},
        ...defaultEndChoices,
    ];
}

async function saveConfigurationFile(overwrite: boolean) {
    let devFile = false;
    const configFile = overwrite ? parseConfigFile() : new AppConfigs();

    if (!configFile) {
        throw new Error("Existing config file could not be parsed.");
    }

    while (true) switch ((await inquirer.prompt<{ action: CREATE_CONFIGURATION_ACTIONS }>([{
        type: "list",
        name: "action",
        message: "Kindly select option to change.",
        choices: generateCreateConfigurationChoices(devFile, configFile.token, configFile.logging_level),
    }
    ])).action) {
        case CREATE_CONFIGURATION_ACTIONS.TOKEN:
            configFile.token = (await inquirer.prompt<{ answer: string }>([{
                type: "input",
                name: "answer",
                message: "Enter token:"
            }])).answer;
            break;
        case CREATE_CONFIGURATION_ACTIONS.LOGGING:
            configFile.logging_level = (await inquirer.prompt<{ answer: string }>([{
                type: "rawlist",
                name: "answer",
                message: "Kindly select your logging level.",
                choices: ["error", "warn", "info", "http", "verbose", "debug", "silly"]
            }])).answer;
            break;
        case CREATE_CONFIGURATION_ACTIONS.DATABASE:
            configFile.database = await databaseConfiguration(configFile.database);
            break;
        case CREATE_CONFIGURATION_ACTIONS.REGISTRATION:
            configFile.commandRegistration = await registrationConfiguration(configFile.commandRegistration);
            break;
        case CREATE_CONFIGURATION_ACTIONS.DEV:
            devFile = !devFile;
            break;
        case CREATE_CONFIGURATION_ACTIONS.FINISH:
            fs.writeFileSync(path.resolve(devFile ? devConfigPath : configPath), JSON.stringify(configFile, null, 2), "utf-8");
            return;
        case CREATE_CONFIGURATION_ACTIONS.QUIT:
            return;
        default:
            break;
    }
}

enum MAIN_MENU_ACTIONS {
    CREATE,
    UPDATE,
    EXIT
}

async function main() {
    switch ((await inquirer.prompt<{ action: MAIN_MENU_ACTIONS }>([{
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            {name: "Create new config.", value: MAIN_MENU_ACTIONS.CREATE},
            {name: "Update the existing config.", value: MAIN_MENU_ACTIONS.UPDATE},
            {type: "separator"},
            {name: "Exit.", value: MAIN_MENU_ACTIONS.EXIT},
        ]
    }])).action) {
        case MAIN_MENU_ACTIONS.CREATE:
            await saveConfigurationFile(false);
            break;
        case MAIN_MENU_ACTIONS.UPDATE:
            await saveConfigurationFile(true);
            break;
        case MAIN_MENU_ACTIONS.EXIT:
            return;
        default:
            break;
    }
}

await main();
