import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Client from "../../Client";
import { Command } from "..";

const command = new SlashCommandBuilder()
  .setName("load_configs")
  .setDescription("Loads the currently saved configs.")
  .setDefaultPermission(false);

async function run(interaction: CommandInteraction) {
  (interaction.client as Client).configs.loadConfigs();
  await interaction.reply({ content: "Done", ephemeral: true });
}

export default new Command(command, run);
