import chalk from "chalk";
import { container } from "tsyringe";
import { BuffManagerModule } from "../buff_manager/index.js";
import { EventManagerModule } from "../event_manager/index.js";
import { GardeningManagerModule } from "../gardening_manager/index.js";
import { ManagerUtilsModule } from "../manager_utils/index.js";
import { PermissionManagerModule } from "../permission_manager/index.js";
import { RoleManagerModule } from "../role_manager/index.js";
import { buildLogger } from "../shared/logger.js";
import { BuildCommand } from "../shared/models/command.js";
const logger = buildLogger("ModuleConfiguration");
const loggerMeta = {
    moduleConfiguration: { context: "ModuleConfiguration" },
    interaction: { context: "InteractionInvoking" },
};
let loadedModules;
export function loadModules() {
    return loadedModules ??= [
        container.resolve(BuffManagerModule),
        container.resolve(EventManagerModule),
        container.resolve(GardeningManagerModule),
        container.resolve(ManagerUtilsModule),
        container.resolve(RoleManagerModule),
        container.resolve(PermissionManagerModule),
    ];
}
async function runEvent(listeners, client, ...args) {
    for (let i = 0; i < listeners.length; i++) {
        try {
            await listeners[i].run(client, ...args);
        }
        catch (error) {
            if (error instanceof Error) {
                logger.error(error.stack, { context: "EventRunner" });
            }
        }
    }
}
export function configureModules(client) {
    client.on("interactionCreate", async (interaction) => {
        logger.debug(chalk.magentaBright("Interaction Innovated"), loggerMeta.interaction);
        try {
            if (interaction.isButton()) {
                logger.debug(chalk.magentaBright("Confirmed Button Interaction."), loggerMeta.interaction);
                // todo: setup buttons.
            }
            if (interaction.isCommand()) {
                logger.debug(chalk.magentaBright("Confirmed Command Interaction."), loggerMeta.interaction);
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) {
                    logger.debug(`No command found with name: ${chalk.yellow(interaction.commandName)}.`, loggerMeta.interaction);
                    return;
                }
                await command.run(interaction);
            }
        }
        catch (err) {
            await interaction.reply({
                content: "There was an internal issue executing the command",
                ephemeral: true,
            });
            logger.error(err.stack, loggerMeta.interaction);
        }
    });
    loadModules().forEach(module => {
        logger.info(`Setting up module ${chalk.blueBright(module.moduleName)}`, loggerMeta.moduleConfiguration);
        client.modules.set(module.moduleName, module);
        logger.debug(`Setting up ${chalk.cyan("commands")}...`, loggerMeta.moduleConfiguration);
        module.commands.forEach(command => client.commands.set(BuildCommand(command).name, command));
        logger.debug(`Setting up ${chalk.cyan("listeners")}...`, loggerMeta.moduleConfiguration);
        module.listeners.forEach(listener => {
            let listeners = client.moduleListeners.get(listener.event);
            if (!listeners) {
                listeners = [];
            }
            listeners.push(listener);
            client.moduleListeners.set(listener.event, listeners);
        });
        logger.debug(`Setting up ${chalk.cyan("tasks")}...`, loggerMeta.moduleConfiguration);
        module.tasks.forEach(task => {
            client.tasks.set(task.name, task);
            setInterval(task.run, task.timeout, client);
            task.run(client).catch(err => console.error(err));
        });
    });
    logger.debug(`Setting up ${chalk.cyan("events")}...`, loggerMeta.moduleConfiguration);
    client.moduleListeners.forEach((listener, event) => {
        switch (event) {
            case "ready":
                client.once(event, async (...args) => runEvent(listener, client, ...args));
                break;
            default:
                client.on(event, async (...args) => runEvent(listener, client, ...args));
                break;
        }
    });
}
//# sourceMappingURL=moduleConfiguration.js.map