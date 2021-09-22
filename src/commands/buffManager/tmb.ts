import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { CommandInteraction } from "discord.js";
import { Command } from "..";
import { postBuff } from "../../modules/buffManager";


const command = new SlashCommandBuilder()
  .setName("tomorrows_buff")
  .setDescription("Displays the buff for tommorow.");

async function run(interaction: CommandInteraction) {
  await postBuff(interaction, dayjs().add(1, "day"), "Tomorrow's Buff Shall Be:");
}

export default new Command(command, run);
