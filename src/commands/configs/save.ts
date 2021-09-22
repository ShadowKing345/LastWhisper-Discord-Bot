import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "..";
import Client from "../../Client";

const command = new SlashCommandBuilder()
  .setName("save_configs")
  .setDescription("Saves the currently running configs.")
  .setDefaultPermission(false);

async function run(interaction: CommandInteraction) {
  (interaction.client as Client).configs.saveConfigs();
  await interaction.reply({ content: "Done", ephemeral: true });
}

export default new Command(command, run);
