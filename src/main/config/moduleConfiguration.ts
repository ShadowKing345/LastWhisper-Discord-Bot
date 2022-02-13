import {Client} from "../classes/client.js";
import {BuffManagerModule} from "../modules/buffManager.module.js";
import {ModuleBase} from "../classes/moduleBase.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {Command} from "../classes/command.js";
import {Listener} from "../classes/listener.js";
import {EventManagerModule} from "../modules/eventManagerModule.js";
import {GardeningModule} from "../modules/gardening.module.js";
import {ManagerUtilsModule} from "../modules/managerUtilsModule.js";
import {RoleManagerModule} from "../modules/roleManagerModule.js";
import {logger} from "../utils/logger.js";
import chalk from "chalk";
import {CommandInteraction} from "discord.js";

export const loadedModules: ModuleBase[] = [
    new BuffManagerModule(),
    new EventManagerModule(),
    new GardeningModule(),
    new ManagerUtilsModule(),
    new RoleManagerModule()
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
        try {
            if (interaction.isButton()) {
                // todo: setup buttons.
            }

            if (interaction.isCommand()) {
                const command: Command = (interaction.client as Client).commands.get(interaction.commandName);
                if (!command) return;

                await command.run(interaction);
            }
        } catch (err) {
            await (interaction as CommandInteraction).reply({
                content: "There was an internal issue executing the command",
                ephemeral: true
            });
            logger.error(err, {context: "InteractionInvoking"});
        }
    });

    loadedModules.forEach(module => {
        logger.info(`Setting up module ${chalk.red(module.moduleName)}`, {context: "ModuleConfiguration"});
        client.modules.set(module.moduleName, module);

        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("commands")}...`, {context: "ModuleConfiguration"});
        module.commands.forEach((command, index, array) => {
            if (typeof command.command === "function") {
                command.command = command.command(new SlashCommandBuilder());
                array[index] = command;
            }
            client.commands.set((command.command as SlashCommandBuilder).name, command);
        });

        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("listeners")}...`, {context: "ModuleConfiguration"});
        module.listeners.forEach(listener => {
            let listeners = client.moduleListeners.get(listener.event);
            if (!listeners) {
                listeners = [];
            }
            listeners.push(listener);
            client.moduleListeners.set(listener.event, listeners);
        });

        logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("tasks")}...`, {context: "ModuleConfiguration"});
        module.tasks.forEach(task => {
            client.tasks.set(task.name, task)
            setInterval(task.run, task.timeout, client);
            task.run(client).catch(err => console.error(err));
        });
    });

    logger.debug(`${" ".repeat(4)}Setting up ${chalk.cyan("events")}...`, {context: "ModuleConfiguration"});
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