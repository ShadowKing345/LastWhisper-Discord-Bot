import {Routes} from "discord-api-types/v9";
import {REST} from "@discordjs/rest";
import chalk from "chalk";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import {AppConfigs, CommandRegistrationConfiguration, initConfigs} from "./appConfigs.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {loadedModules} from "./moduleConfiguration.js";
import {logger} from "../utils/logger.js";
import {Command} from "../classes/command.js";

dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

const appConfigs: AppConfigs = initConfigs();
const commandConfigs: CommandRegistrationConfiguration = appConfigs.commandRegistration;
const rest = new REST({version: "9"}).setToken(appConfigs.token);

const loggerMeta = {context: "CommandRegistration"};

function getCommandJson(command: Command) {
    if (command.command instanceof SlashCommandBuilder) {
        return command.command.toJSON();
    } else if (typeof command.command === "function") {
        return (command.command(new SlashCommandBuilder())).toJSON();
    }
}

const isForRegistering = (done = false) => commandConfigs.unregister ? chalk.red(done ? "removed" : "removal") : chalk.green(done ? "registered" : "registration");
const isForGlobal = () => commandConfigs.registerForGuild ? `commands for guild ${chalk.yellow(commandConfigs.guildId)}` : chalk.yellow("global commands");

async function main(): Promise<void> {
    logger.info(`Begging ${isForRegistering()} of ${isForGlobal()}.`, loggerMeta);
    const route = commandConfigs.registerForGuild ?
        Routes.applicationGuildCommands(commandConfigs.clientId, commandConfigs.guildId) :
        Routes.applicationCommands(commandConfigs.clientId);

    if (commandConfigs.unregister) {
        logger.info(`${chalk.cyan("Acquiring")} ${isForGlobal()} for deletion.`, loggerMeta);
        const commands = await rest.get(route) as { id: string }[];

        logger.info(`${chalk.cyan("Removing")} ${isForGlobal()}`, loggerMeta);
        for (const command of commands) {
            await rest.delete(`${route}/${command.id}`);
        }
    } else {
        logger.info(`${chalk.cyan("Generating")} ${isForGlobal()}`, loggerMeta);
        const commands = [];
        loadedModules.forEach(module => {
            if (module.command) {
                commands.push(getCommandJson(module.command));
            }
            for (const command of module.commands) {
                commands.push(getCommandJson(command));
            }
        });

        logger.info(`${chalk.cyan("Registering")} ${isForGlobal()}`, loggerMeta);
        await rest.put(route, {body: commands});
    }

    logger.info(`${chalk.green("Successfully")} ${isForRegistering(true)} ${isForGlobal()}`, loggerMeta);
}

main().catch(error => logger.error(error, loggerMeta));
