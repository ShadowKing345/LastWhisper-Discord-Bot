import path from "path";
import {fileURLToPath} from "url";
import {readdir} from "fs/promises";
import fs from "fs";
import Client from "../classes/Client";
import {Interaction} from "discord.js";
import {Module} from "../classes/Module";
import Command from "../classes/Command";

async function readModules(callback: (module: Module) => void) {
    const relativePath: string = path.dirname(fileURLToPath(import.meta.url));

    for (const item of await readdir(relativePath)) {
        const filePath = path.resolve(path.join(relativePath, item));
        if (!fs.lstatSync(filePath).isFile()) continue;

        const imported = (await import(filePath)).default;
        if (imported instanceof Module)
            callback(imported);
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
        module.listeners.forEach(({run}) => run(client));
    });
}

export {readModules};
