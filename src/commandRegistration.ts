import { REST, RouteLike } from "@discordjs/rest";
import { container } from "tsyringe";

import { App } from "./app.js";
import { LoggerService } from "./utils/loggerService.js";
import { ProjectConfiguration, CommandRegistrationConfiguration } from "./utils/models/index.js";
import {
  Routes,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandSubcommandGroupOption,
} from "discord-api-types/v10";

/**
 * Command registration argument used when registering commands.
 */
type CommandRegistrationArgs = {
  // Token for bot.
  token?: string;
  // Client discord id.
  client?: string;
  /**
   * Guild discord id.
   * Set to register commands for this guild only.
   */
  guild?: string;
  // Set to true if you wish to unregister commands.
  unregister?: boolean;
};

/**
 * Command that attempted to register the slash command to the bot.
 * @param args Arguments for command registration.
 */
export async function commandRegistration(args: CommandRegistrationArgs): Promise<void> {
  const app = container.resolve(App);
  const logger = container.resolve(LoggerService).buildLogger("CommandRegistration");
  logger.info("Welcome again to command registration or un-registration.");

  const appConfigs: ProjectConfiguration = container.resolve(ProjectConfiguration);
  const commandConfigs: CommandRegistrationConfiguration | undefined = appConfigs.commandRegistration;

  if (!commandConfigs) {
    throw new Error("Command configurations were not set.");
  }

  if (args.token) appConfigs.token = args.token;
  if (args.client) commandConfigs.clientId = args.client;
  if (args.guild) {
    commandConfigs.guildId = args.guild;
    commandConfigs.registerForGuild = true;
  }
  if (args.unregister) commandConfigs.unregister = true;

  const rest = new REST({ version: "10" }).setToken(appConfigs.token);

  const isRegistering = commandConfigs.unregister ? "unregistering" : "registering";
  const isGlobal = commandConfigs.registerForGuild ? `guild ${commandConfigs.guildId}` : "everyone";

  try {
    const route: RouteLike = commandConfigs.registerForGuild
      ? Routes.applicationGuildCommands(commandConfigs.clientId, commandConfigs.guildId)
      : Routes.applicationCommands(commandConfigs.clientId);

    logger.info(`Beginning command ${isRegistering} for ${isGlobal}.`);

    let promise: Promise<unknown>;
    if (commandConfigs.unregister) {
      const commands = (await rest.get(route)) as { id: string }[];
      promise = Promise.all(commands.map(command => rest.delete(`${route}/${command.id}`)));
    } else {
      const commands: (
        | RESTPostAPIChatInputApplicationCommandsJSONBody
        | APIApplicationCommandSubcommandGroupOption
        | APIApplicationCommandSubcommandOption
      )[] = [];
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
  } catch (error) {
    logger.error(error instanceof Error ? error.stack : error);
  }
}
