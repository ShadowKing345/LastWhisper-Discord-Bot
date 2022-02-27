var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Routes } from "discord-api-types/v9";
import { REST } from "@discordjs/rest";
import chalk from "chalk";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { initConfigs } from "./appConfigs.js";
import { loadedModules } from "./moduleConfiguration.js";
import { logger } from "../utils/logger.js";
import { BuildCommand } from "../classes/command.js";
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
const appConfigs = initConfigs();
const commandConfigs = appConfigs.commandRegistration;
const rest = new REST({ version: "9" }).setToken(appConfigs.token);
const loggerMeta = { context: "CommandRegistration" };
const isForRegistering = (done = false) => commandConfigs.unregister ? chalk.red(done ? "removed" : "removal") : chalk.green(done ? "registered" : "registration");
const isForGlobal = () => commandConfigs.registerForGuild ? `commands for guild ${chalk.yellow(commandConfigs.guildId)}` : chalk.yellow("global commands");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        logger.info(`Beginning ${isForRegistering()} of ${isForGlobal()}.`, loggerMeta);
        const route = commandConfigs.registerForGuild ?
            Routes.applicationGuildCommands(commandConfigs.clientId, commandConfigs.guildId) :
            Routes.applicationCommands(commandConfigs.clientId);
        if (commandConfigs.unregister) {
            logger.info(`${chalk.cyan("Acquiring")} ${isForGlobal()} for deletion.`, loggerMeta);
            const commands = yield rest.get(route);
            logger.info(`${chalk.cyan("Removing")} ${isForGlobal()}`, loggerMeta);
            for (const command of commands) {
                yield rest.delete(`${route}/${command.id}`);
            }
        }
        else {
            logger.info(`${chalk.cyan("Generating")} ${isForGlobal()}`, loggerMeta);
            const commands = [];
            loadedModules.forEach(module => {
                for (const command of module.commands) {
                    commands.push(BuildCommand(command).toJSON());
                }
            });
            logger.info(`${chalk.cyan("Registering")} ${isForGlobal()}`, loggerMeta);
            yield rest.put(route, { body: commands });
        }
        logger.info(`${chalk.green("Successfully")} ${isForRegistering(true)} ${isForGlobal()}`, loggerMeta);
    });
}
main().catch(error => logger.error(error, loggerMeta));
//# sourceMappingURL=commandRegistration.js.map