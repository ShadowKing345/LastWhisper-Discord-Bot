import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";

/**
 * Chat Input command object.
 */
export class ChatInputCommand {
    public command: ((builder: SlashCommandBuilder) => any);
    public execute: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
}