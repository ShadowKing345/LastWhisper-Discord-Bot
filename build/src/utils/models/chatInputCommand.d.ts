import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
/**
 * Chat Input command object.
 */
export declare class ChatInputCommand {
    command: ((builder: SlashCommandBuilder) => any);
    execute: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
}
//# sourceMappingURL=chatInputCommand.d.ts.map