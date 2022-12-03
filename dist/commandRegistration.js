import { REST } from "@discordjs/rest";
import { container } from "tsyringe";
import { App } from "./app.js";
import { LoggerService } from "./services/loggerService.js";
import { ProjectConfiguration } from "./utils/objects/index.js";
import { Routes, } from "discord-api-types/v10";
export async function commandRegistration(args) {
    const app = container.resolve(App);
    const logger = container.resolve(LoggerService).buildLogger("CommandRegistration");
    logger.info("Welcome again to command registration or un-registration.");
    const appConfigs = container.resolve(ProjectConfiguration);
    const commandConfigs = appConfigs.commandRegistration;
    if (!commandConfigs) {
        throw new Error("Command configurations were not set.");
    }
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
    const rest = new REST({ version: "10" }).setToken(appConfigs.token);
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