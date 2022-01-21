import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

export default class Command {
    command: Partial<SlashCommandBuilder | ((builder: SlashCommandBuilder) => SlashCommandBuilder)>;
    run: (interaction: CommandInteraction) => Promise<void>;

    constructor(command: Partial<SlashCommandBuilder | ((builder: SlashCommandBuilder) => SlashCommandBuilder)>, run: (interaction: CommandInteraction) => Promise<void>) {
        this.command = command;
        this.run = run;
    }
}