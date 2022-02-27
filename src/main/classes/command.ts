import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

export class Command {
    public command: Partial<SlashCommandBuilder | ((builder: SlashCommandBuilder) => SlashCommandBuilder)>;
    public run: (interaction: CommandInteraction) => Promise<void>;
}

export function BuildCommand(command: Command): SlashCommandBuilder {
    if (!command.command) {
        return null;
    }

    if (command.command instanceof SlashCommandBuilder) {
        return command.command;
    } else if (typeof command.command === "function") {
        return (command.command(new SlashCommandBuilder()));
    }
}
