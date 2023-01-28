import { REST, Routes } from "discord.js";
import { container } from "tsyringe";
import { ConfigurationService } from "./config/configurationService.js";
import { CommandRegistrationConfiguration, CommonConfigurationKeys, Logger, ModuleService } from "./config/index.js";
import { deepMerge } from "./utils/index.js";
const logger = new Logger("CommandRegistration");
function isRejectedPromise(obj) {
    if (typeof obj !== "object" || Array.isArray(obj)) {
        return false;
    }
    return "status" in obj && obj.status === "rejected";
}
async function unregister(rest, route) {
    const commands = (await rest.get(route));
    const result = await Promise.allSettled(commands.map(command => rest.delete(`${route}/${command.id}`)));
    if (Array.isArray(result)) {
        for (const r of result) {
            if (isRejectedPromise(r)) {
                logger.error(r.reason);
            }
        }
    }
}
async function register(rest, route, modules) {
    const commands = [];
    for (const module of modules) {
        for (const command of module.commands) {
            commands.push(command.build().toJSON());
        }
    }
    await rest.put(route, { body: commands });
}
export async function manageCommands(token = ConfigurationService.getConfiguration(CommonConfigurationKeys.TOKEN), args = new CommandRegistrationConfiguration(), modules = container.resolve(ModuleService)) {
    logger.info("Welcome again to command registration or un-registration.");
    const commandConfigs = deepMerge(ConfigurationService.getConfiguration(CommonConfigurationKeys.COMMAND_REGISTRATION) ?? new CommandRegistrationConfiguration(), args);
    if (!commandConfigs?.isValid) {
        throw new Error("Command configuration was not setup correctly.");
    }
    const rest = new REST({ version: "10" }).setToken(token);
    const isRegistering = commandConfigs.unregister ? "unregistering" : "registering";
    const isGlobal = commandConfigs.registerForGuild ? `guild ${commandConfigs.guildId}` : "everyone";
    try {
        const route = commandConfigs.registerForGuild
            ? Routes.applicationGuildCommands(commandConfigs.clientId, commandConfigs.guildId)
            : Routes.applicationCommands(commandConfigs.clientId);
        logger.info(`Beginning command ${isRegistering} for ${isGlobal}.`);
        await (commandConfigs.unregister ? unregister(rest, route) : register(rest, route, modules.filteredModules));
        logger.info(`Finished ${isRegistering} for ${isGlobal}.`);
    }
    catch (error) {
        logger.error(error instanceof Error ? error.stack : error);
    }
}
//# sourceMappingURL=slashCommandManager.js.map