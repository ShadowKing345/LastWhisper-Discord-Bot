import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { CommandInteraction } from "discord.js";
import { Command } from "..";
import { postBuff } from "../../modules/buffManager";


const command = new SlashCommandBuilder()
  .setName("todays_buff")
  .setDescription("Displays the buff for the day.");

async function run(interaction: CommandInteraction) {
  await postBuff(interaction, dayjs(), "Today's Buff Shall Be:");
}

export default new Command(command, run);
