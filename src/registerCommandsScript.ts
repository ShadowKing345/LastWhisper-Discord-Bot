import { REST, RouteLike, Routes } from "discord.js";
import { container } from "tsyringe";
import { ConfigurationService } from "./config/configurationService.js";
import { CommandRegistrationConfiguration, CommonConfigurationKeys, Logger, ModuleService } from "./config/index.js";
import { Module } from "./modules/module.js";
import { deepMerge } from "./utils/index.js";

const logger = new Logger("CommandRegistration");

/**
 * Checks if an unknown is a rejected promise.
 * @param obj
 */
function isRejectedPromise(obj: unknown): obj is PromiseRejectedResult {
  if (typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }

  return "status" in obj && obj.status === "rejected";
}

/**
 * Unregisters commands from a route.
 * Handles the result if any fails.
 * @param rest The rest api.
 * @param route The route to delete commands for.
 */
async function unregister(rest: REST, route: RouteLike) {
  const commands = (await rest.get(route)) as { id: string }[];
  const result = await Promise.allSettled(commands.map(command => rest.delete(`${route}/${command.id}`)));

  if (Array.isArray(result)) {
    for (const r of result) {
      if (isRejectedPromise(r)) {
        logger.error(r.reason);
      }
    }
  }
}

/**
 * Registers commands for a route.
 * @param rest The REST object.
 * @param route The route.
 * @param modules All modules to get the command of.
 */
async function register(rest: REST, route: RouteLike, modules: Module[]) {
  const commands = [];
  for (const module of modules) {
    for (const command of module.commands) {
      commands.push(command.build().toJSON());
    }
  }

  await rest.put(route, { body: commands });
}

/**
 * Command that attempted to register the slash command to the bot.
 * @param token The token to be used. Overrides the configuration token.
 * @param args Arguments for command registration. Same as configuration.
 * @param modules Override for the module service.
 */
export async function registerCommands(
  token: string = ConfigurationService.getConfiguration<string>(CommonConfigurationKeys.TOKEN),
  args: CommandRegistrationConfiguration = new CommandRegistrationConfiguration(),
  modules: ModuleService = container.resolve<ModuleService>(ModuleService),
): Promise<void> {
  logger.info("Welcome again to command registration or un-registration.");

  const commandConfigs: CommandRegistrationConfiguration = deepMerge(ConfigurationService.getConfiguration(CommonConfigurationKeys.COMMAND_REGISTRATION) ?? new CommandRegistrationConfiguration(), args);

  if (!commandConfigs?.isValid) {
    throw new Error("Command configuration was not setup correctly.");
  }

  const rest = new REST({ version: "10" }).setToken(token);

  const isRegistering = commandConfigs.unregister ? "unregistering" : "registering";
  const isGlobal = commandConfigs.registerForGuild ? `guild ${commandConfigs.guildId}` : "everyone";

  try {
    const route: RouteLike = commandConfigs.registerForGuild
      ? Routes.applicationGuildCommands(commandConfigs.clientId, commandConfigs.guildId)
      : Routes.applicationCommands(commandConfigs.clientId);

    logger.info(`Beginning command ${isRegistering} for ${isGlobal}.`);

    await (commandConfigs.unregister ? unregister(rest, route) : register(rest, route, modules.modules));
    logger.info(`Finished ${isRegistering} for ${isGlobal}.`);
  } catch (error) {
    logger.error(error instanceof Error ? error.stack : error);
  }
}
