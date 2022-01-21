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
import GardeningModule from "./gardeningModule";
import {SlashCommandBuilder} from "@discordjs/builders";

export {EventModule, RoleModule, ManagerUtilsModule, BuffModule, GardeningModule};
export const Modules = [EventModule, RoleModule, ManagerUtilsModule, BuffModule, new GardeningModule()];

// endregion

function readModules(callback: (module: Module) => void) {
    for (let module of Modules) {
        callback(module);
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
    client.on("interactionCreate", (interaction: Interaction) => {
        if (interaction.isButton()) {
            console.log(interaction.customId)
            interaction.reply({content: "yolo", ephemeral: true});
        }

        if (interaction.isCommand()) {
            const command: Command | undefined = (interaction.client as Client).commands.get(interaction.commandName);
            if (!command) return;

            command.run(interaction).catch(err => {
                console.error(err);
                return interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true
                });
            });
        }
    });

    readModules(module => {
        client.modules.set(module.name, module);
        module.commands.forEach((command, index, array) => {
            command.command = typeof command.command === "function" ? command.command(new SlashCommandBuilder()) : command.command;
            array[index] = command;
            client.commands.set((command.command as SlashCommandBuilder).name, command);
        });
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
