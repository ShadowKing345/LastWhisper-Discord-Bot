import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

export class Command {
    public command: Partial<SlashCommandBuilder | ((builder: SlashCommandBuilder) => SlashCommandBuilder)>;
    public run: (interaction: CommandInteraction) => Promise<void>;
}