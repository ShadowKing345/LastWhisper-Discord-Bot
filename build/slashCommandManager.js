import { REST, Routes } from "discord.js";
import { ConfigurationService } from "./config/configurationService.js";
import { CommandRegistrationConfiguration, CommonConfigurationKeys, Logger, ModuleService } from "./config/index.js";
import { deepMerge, isPromiseRejected } from "./utils/index.js";
const logger = new Logger("CommandRegistration");
async function unregister(rest, route) {
    const commands = (await rest.get(route));
    const result = await Promise.allSettled(commands.map(command => rest.delete(`${route}/${command.id}`)));
    if (Array.isArray(result)) {
        for (const r of result) {
            if (isPromiseRejected(r)) {
                logger.error(r.reason);
            }
        }
    }
}
async function register(rest, route, slashCommands) {
    const commands = [];
    for (const slashCommand of slashCommands) {
        commands.push(slashCommand.build().toJSON());
    }
    await rest.put(route, { body: commands });
}
export async function manageCommands(token = ConfigurationService.getConfiguration(CommonConfigurationKeys.TOKEN), args = new CommandRegistrationConfiguration(), commands = ModuleService.getSlashCommands().map(struct => struct.value)) {
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
        await (commandConfigs.unregister ? unregister(rest, route) : register(rest, route, commands));
        logger.info(`Finished ${isRegistering} for ${isGlobal}.`);
    }
    catch (error) {
        logger.error(error instanceof Error ? error.stack : error);
    }
}
//# sourceMappingURL=slashCommandManager.js.map