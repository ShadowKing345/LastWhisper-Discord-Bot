import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType as OptionType, APIApplicationCommandOptionChoice } from "discord.js";
declare type SlashCommand = SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;
export declare class Command {
    name: string;
    description: string;
    execute: (interaction: ChatInputCommandInteraction) => Promise<unknown> | unknown;
    subcommands?: {
        [key: string]: Command;
    };
    options: CommandOptions;
    constructor(data?: Partial<Command>);
    merge(obj: Partial<Command>): Command;
    build(builder?: SlashCommand): SlashCommand;
}
export declare class CommandOption {
    name: string;
    description: string;
    type: OptionType;
    required: boolean;
    choices: APIApplicationCommandOptionChoice<unknown>[];
    constructor(data?: Partial<CommandOption>);
    private buildOptionCallback;
    build(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder): SlashCommandBuilder | SlashCommandSubcommandBuilder;
    merge(obj: Partial<CommandOption>): CommandOption;
}
export declare type Commands = Command[];
export declare type CommandOptions = CommandOption[];
export {};
//# sourceMappingURL=command.d.ts.map