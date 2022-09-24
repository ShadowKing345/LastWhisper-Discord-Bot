import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { container } from "tsyringe";
import { App } from "../app.js";
import { LoggerFactory } from "../shared/logger/logger.js";
import { BuildCommand } from "../shared/models/command.js";
import { ProjectConfiguration } from "./app_configs/index.js";
const loggerMeta = { context: "CommandRegistration" };
/**
 * Command that attempted to register the slash command to the bot.
 * @param args Arguments for command registration.
 */
export async function commandRegistration(args) {
    const app = container.resolve(App);
    const logger = container.resolve(LoggerFactory).buildLogger("CommandRegistration");
    console.log("Welcome again to command registration or un-registration.");
    const appConfigs = container.resolve(ProjectConfiguration);
    const commandConfigs = appConfigs.commandRegistration;
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
    const rest = new REST({ version: "9" }).setToken(appConfigs.token);
    const isForRegistering = (done = false) => commandConfigs.unregister ? done ? "removed" : "removal" : done ? "registered" : "registration";
    const isForGlobal = () => commandConfigs.registerForGuild ? `commands for guild ${commandConfigs.guildId}` : "global commands";
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