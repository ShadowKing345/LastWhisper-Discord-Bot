import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
export declare class Command {
    command: Partial<SlashCommandBuilder | ((builder: SlashCommandBuilder) => SlashCommandBuilder)>;
    run: (interaction: CommandInteraction) => Promise<void>;
}
