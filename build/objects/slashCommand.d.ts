import { SlashCommandBuilder } from "@discordjs/builders";
import { APIApplicationCommandOptionChoice, ApplicationCommandOptionType as OptionType, ChatInputCommandInteraction, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
type SlashCommandType = SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;
export declare class SlashCommand {
    name: string;
    description: string;
    callback: (interaction: ChatInputCommandInteraction) => Promise<unknown> | unknown;
    subcommands?: {
        [key: string]: SlashCommand;
    };
    options: CommandOptions;
    constructor(data?: Partial<SlashCommand>);
    merge(obj: Partial<SlashCommand>): SlashCommand;
    build(builder?: SlashCommandType): SlashCommandType;
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
export type SlashCommands = SlashCommand[];
export type CommandOptions = CommandOption[];
export {};
//# sourceMappingURL=slashCommand.d.ts.map