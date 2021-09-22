import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { CommandInteraction } from "discord.js";
import { Command } from "..";
import { postWeeksBuffs } from "../../modules/buffManager";

const command = new SlashCommandBuilder()
  .setName("this_weeks_buff")
  .setDescription("Displays the buffs for the week");

async function run(interaction: CommandInteraction) {
  await postWeeksBuffs(interaction, dayjs(), "The Buffs For The Week Shall Be:");
}

export default new Command(command, run);
