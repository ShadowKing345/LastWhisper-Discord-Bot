import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
export declare class Command {
    command: ((builder: SlashCommandBuilder) => any);
    run: (interaction: CommandInteraction) => Promise<void>;
}
export declare function BuildCommand(command: Command): SlashCommandBuilder;
//# sourceMappingURL=command.d.ts.map