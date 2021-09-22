import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { CommandInteraction } from "discord.js";
import { Command } from "..";
import { postWeeksBuffs } from "../../modules/buffManager";

const command = new SlashCommandBuilder()
  .setName("next_weeks_buff")
  .setDescription("Displays the buffs for next week");

async function run(interaction: CommandInteraction) {
  await postWeeksBuffs(interaction, dayjs().add(1, "week"), "The Buffs For Next Week Shall Be:");
}

export default new Command(command, run);
