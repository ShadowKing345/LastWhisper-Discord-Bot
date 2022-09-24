import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export class Command {
    public command: ((builder: SlashCommandBuilder) => any);
    public run: (interaction: CommandInteraction) => Promise<void>;
}

export function BuildCommand(command: Command): SlashCommandBuilder {
    return command.command(new SlashCommandBuilder()) as SlashCommandBuilder;
}
