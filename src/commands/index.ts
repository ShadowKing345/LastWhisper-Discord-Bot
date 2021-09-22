import path from "path";
import { Awaited, CommandInteraction, Interaction } from "discord.js";
import fs from "fs";
import { readdir } from "fs/promises";
import Client from "../Client";
import { SlashCommandBuilder } from "@discordjs/builders";

class Command {
  command: Partial<SlashCommandBuilder>;
  run: (interaction: CommandInteraction) => Awaited<void>;

  constructor(command: Partial<SlashCommandBuilder>, run: (interaction: CommandInteraction) => Awaited<void>) {
    this.command = command;
    this.run = run;
  }
}

async function readCommands(callback: (module: Command) => void) {
  const relativePath: string = __dirname;
  const folders = await readdir(relativePath);

  for (const folder of folders) {
    const folderPath = path.join(relativePath, folder);
    if (fs.lstatSync(folderPath).isFile()) continue;

    for (const file of await readdir(folderPath)) {
      const filePath = path.resolve(path.join(folderPath, file));

      if (!fs.lstatSync(filePath).isFile()) continue;

      callback((await import(filePath)).default as Command);
    }
  }
}

export default async (client: Client) => {
  if (!client) return;

  client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command: Command | undefined = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.run(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
  });

  await readCommands((module: Command) => client.commands.set(module.command.name || module.run.name, module));
}

export { readCommands, Command };
