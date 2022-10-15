import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";

export class ChatCommand {
    public command: ((builder: SlashCommandBuilder) => any);
    public run: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
}

export function BuildCommand(command: ChatCommand): SlashCommandBuilder {
    return command.command(new SlashCommandBuilder()) as SlashCommandBuilder;
}
