import "reflect-metadata";
import {container} from "tsyringe";

import {Client} from "../classes/client.js";
import {BuffManagerModule} from "../modules/buffManager.module.js";
import {ModuleBase} from "../classes/moduleBase.js";
import {BuildCommand, Command} from "../classes/command.js";
import {Listener} from "../classes/listener.js";
import {EventManagerModule} from "../modules/eventManagerModule.js";
import {GardeningModule} from "../modules/gardening.module.js";
import {ManagerUtilsModule} from "../modules/managerUtilsModule.js";
import {RoleManagerModule} from "../modules/roleManagerModule.js";
import {logger} from "../utils/logger.js";
import chalk from "chalk";
import {CommandInteraction} from "discord.js";

const loggerMeta = {
    moduleConfiguration: {context: "ModuleConfiguration"},
    interaction: {context: "InteractionInvoking"}
};


export const loadedModules: ModuleBase[] = [
    container.resolve(BuffManagerModule),
    container.resolve(EventManagerModule),
    container.resolve(GardeningModule),
    container.resolve(ManagerUtilsModule),
    container.resolve(RoleManagerModule)
];

async function runEvent(listeners: Listener[], client: Client, ...args) {
    for (let i = 0; i < listeners.length; i++) {
        try {
            await listeners[i].run(client, ...args);
        } catch (error) {
            logger.error(error, {context: "EventRunner"});
        }
    }
}

export function loadModules(client: Client) {
    client.on("interactionCreate", async (interaction) => {
        logger.debug(chalk.magentaBright("Interaction Innovated"), loggerMeta.interaction);

        try {
            if (interaction.isButton()) {
                logger.debug(chalk.magentaBright("Confirmed Button Interaction."), loggerMeta.interaction);
                // todo: setup buttons.
            }

            if (interaction.isCommand()) {
                logger.debug(chalk.magentaBright("Confirmed Command Interaction."), loggerMeta.interaction);
                const command: Command = (interaction.client as Client).commands.get(interaction.commandName);
                if (!command) {
                    logger.debug(`No command found with name: ${chalk.yellow(interaction.commandName)}.`, loggerMeta.interaction);
                    return;
                }

                await command.run(interaction);
            }
        } catch (err) {
            await (interaction as CommandInteraction).reply({
                content: "There was an internal issue executing the command",
                ephemeral: true
            });
            logger.error(err, loggerMeta.interaction);
        }
    });

    loadedModules.forEach(module => {
        logger.info(`Setting up module ${chalk.blueBright(module.moduleName)}`, loggerMeta.moduleConfiguration);
        client.modules.set(module.moduleName, module);

        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("commands")}...`, loggerMeta.moduleConfiguration);
        module.commands.forEach(command => client.commands.set(BuildCommand(command).name, command as Command));

        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("listeners")}...`, loggerMeta.moduleConfiguration);
        module.listeners.forEach(listener => {
            let listeners = client.moduleListeners.get(listener.event);
            if (!listeners) {
                listeners = [];
            }
            listeners.push(listener);
            client.moduleListeners.set(listener.event, listeners);
        });

        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("tasks")}...`, loggerMeta.moduleConfiguration);
        module.tasks.forEach(task => {
            client.tasks.set(task.name, task)
            setInterval(task.run, task.timeout, client);
            task.run(client).catch(err => console.error(err));
        });
    });

    logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("events")}...`, loggerMeta.moduleConfiguration);
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
