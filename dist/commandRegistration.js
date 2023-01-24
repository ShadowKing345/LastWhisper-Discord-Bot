import { REST, Routes, } from "discord.js";
import { container } from "tsyringe";
import { ConfigurationService } from "./config/configurationService.js";
import { ApplicationConfiguration, CommandRegistrationConfiguration, CommonConfigurationKeys, Logger, } from "./config/index.js";
import { deepMerge } from "./utils/index.js";
import { Bot } from "./utils/objects/index.js";
export async function commandRegistration(token = null, args = new CommandRegistrationConfiguration()) {
    const app = container.resolve(Bot);
    const logger = new Logger("CommandRegistration");
    logger.info("Welcome again to command registration or un-registration.");
    const appConfigs = ConfigurationService.GetConfiguration(CommonConfigurationKeys.APPLICATION, ApplicationConfiguration);
    const commandConfigs = deepMerge(appConfigs?.commandRegistration ?? new CommandRegistrationConfiguration(), args);
    if (!commandConfigs?.isValid) {
        throw new Error("Command configuration was not setup correctly.");
    }
    if (args.unregister)
        commandConfigs.unregister = true;
    const rest = new REST({ version: "10" }).setToken(token ?? appConfigs.token);
    const isRegistering = commandConfigs.unregister ? "unregistering" : "registering";
    const isGlobal = commandConfigs.registerForGuild ? `guild ${commandConfigs.guildId}` : "everyone";
    try {
        const route = commandConfigs.registerForGuild
            ? Routes.applicationGuildCommands(commandConfigs.clientId, commandConfigs.guildId)
            : Routes.applicationCommands(commandConfigs.clientId);
        logger.info(`Beginning command ${isRegistering} for ${isGlobal}.`);
        let promise;
        if (commandConfigs.unregister) {
            const commands = (await rest.get(route));
            promise = Promise.all(commands.map(command => rest.delete(`${route}/${command.id}`)));
        }
        else {
            const commands = [];
            app.modules.forEach(module => {
                for (const command of module.commands) {
                    commands.push(command.build().toJSON());
                }
            });
            promise = rest.put(route, { body: commands });
        }
        await promise;
        logger.info(`Finished ${isRegistering} for ${isGlobal}.`);
        process.exit(0);
    }
    catch (error) {
        logger.error(error instanceof Error ? error.stack : error);
    }
}
//# sourceMappingURL=commandRegistration.js.map