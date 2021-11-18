import path from "path";
import {readdir} from "fs/promises";
import fs from "fs";
import Client from "../classes/Client";
import {Interaction} from "discord.js";
import {Module} from "../classes/Module";
import Command from "../classes/Command";
import Listener from "../classes/Listener";

// region Module Export
import EventModule from "./eventManager";
import RoleModule from "./roleManager";
import ManagerUtilsModule from "./managerUtils";
import BuffModule from "./buffManager";

export {EventModule, RoleModule, ManagerUtilsModule, BuffModule};
export const Modules = [EventModule, RoleModule, ManagerUtilsModule, BuffModule];

        const imported = (await import(filePath)).default;
        if (imported instanceof Module)
            callback(imported);
    }
}

async function runEvent(listeners: Listener[], ...args) {
    for (let i = 0; i < listeners.length; i++) {
        try {
            await listeners[i].run(...args);
        } catch (e) {
            console.error(e);
        }
    }
}

export default async (client: Client) => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const command: Command | undefined = (interaction.client as Client).commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.run(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: "There was an error while executing this command!", ephemeral: true});
        }
    });

    await readModules((module: Module) => {
        client.modules.set(module.name, module);
        module.commands.forEach(command => client.commands.set(command.command.name, command));
        module.tasks.forEach(task => {
            client.tasks.set(task.name, task);
            setInterval(task.run, task.timeout, client);
            task.run(client);
        });
        module.listeners.forEach(listener => {
            let collection: Listener[] = client.moduleListeners.get(listener.event) ?? [];

            collection.push(listener);
            client.moduleListeners.set(listener.event, collection);
        });
    });

    client.moduleListeners.forEach((listener, event) => {
        switch (event) {
            case "ready":
                client.once(event, async () => runEvent(listener, client));
                break;
            default:
                client.on(event, async (...args) => runEvent(listener, ...args));
                break;
        }
    });
}

export {readModules};
