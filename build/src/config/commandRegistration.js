import { REST } from "@discordjs/rest";
import chalk from "chalk";
import { Routes } from "discord-api-types/v9";
import { container } from "tsyringe";
import { App } from "../app.js";
import { LoggerFactory } from "../shared/logger/logger.js";
import { BuildCommand } from "../shared/models/command.js";
import { AppConfig } from "./app_configs/index.js";
const loggerMeta = { context: "CommandRegistration" };
export async function commandRegistration(args) {
    const app = container.resolve(App);
    const logger = container.resolve(LoggerFactory).buildLogger("CommandRegistration");
    console.log("Welcome again to command registration or un-registration.");
    const appConfigs = container.resolve(AppConfig);
    const commandConfigs = appConfigs.commandRegistration;
    const rest = new REST({ version: "9" }).setToken(appConfigs.token);
    if (args.token)
        appConfigs.token = args.token;
    if (args.client)
        commandConfigs.clientId = args.client;
    if (args.guild) {
        commandConfigs.guildId = args.guild;
        commandConfigs.registerForGuild = true;
    }
    if (args.unregister)
        commandConfigs.unregister = true;
    const isForRegistering = (done = false) => commandConfigs.unregister ? chalk.red(done ? "removed" : "removal") : chalk.green(done ? "registered" : "registration");
    const isForGlobal = () => commandConfigs.registerForGuild ? `commands for guild ${chalk.yellow(commandConfigs.guildId)}` : chalk.yellow("global commands");
    try {
        logger.info(`Beginning ${isForRegistering()} of ${isForGlobal()}.`, loggerMeta);
        const route = commandConfigs.registerForGuild ?
            Routes.applicationGuildCommands(commandConfigs.clientId, commandConfigs.guildId) :
            Routes.applicationCommands(commandConfigs.clientId);
        if (commandConfigs.unregister) {
            logger.info(`Acquiring ${isForGlobal()} for deletion.`, loggerMeta);
            const commands = await rest.get(route);
            logger.info(`Removing ${isForGlobal()}`, loggerMeta);
            for (const command of commands) {
                await rest.delete(`${route}/${command.id}`);
            }
        }
        else {
            logger.info(`Generating ${isForGlobal()}`, loggerMeta);
            const commands = [];
            app.modules.forEach(module => {
                for (const command of module.commands) {
                    commands.push(BuildCommand(command).toJSON());
                }
            });
            logger.info(`Registering ${isForGlobal()}`, loggerMeta);
            await rest.put(route, { body: commands });
        }
        logger.info(`Successfully ${isForRegistering(true)} ${isForGlobal()}`, loggerMeta);
    }
    catch (error) {
        logger.error(error.stack, loggerMeta);
    }
    finally {
        process.exit(0);
    }
}
//# sourceMappingURL=commandRegistration.js.map