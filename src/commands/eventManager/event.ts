import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "..";
import { event } from "../../modules/evenManager";

const command = new SlashCommandBuilder()
  .setName("event")
  .setDescription("Displays events.")
  .addIntegerOption(option => option.setName("index").setDescription("The index for the event, starting at 0"));

async function run(interaction: CommandInteraction) {
  await event(interaction);
}

export default new Command(command, run);
