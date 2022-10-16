/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "./toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType as OptionType, APIApplicationCommandOptionChoice } from "discord.js";
declare type SlashCommand = SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;
export declare class CommandBuilder extends ToJsonBase<CommandBuilder> {
    name: string;
    description: string;
    execute?: (interaction: ChatInputCommandInteraction) => Promise<any>;
    subcommands?: {
        [key: string]: Partial<CommandBuilder>;
    };
    options: CommandBuilderOptions;
    constructor(data?: Partial<CommandBuilder>);
    merge(obj: Partial<CommandBuilder>): CommandBuilder;
    build(builder?: SlashCommand): SlashCommand;
}
export declare class CommandBuilderOption extends ToJsonBase<CommandBuilderOption> {
    name: string;
    description: string;
    type: OptionType;
    required: boolean;
    choices: APIApplicationCommandOptionChoice<any>[];
    constructor(data?: Partial<CommandBuilderOption>);
    build(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder): SlashCommandBuilder | SlashCommandSubcommandBuilder;
    merge(obj: Partial<CommandBuilderOption>): CommandBuilderOption;
}
export declare type CommandBuilders = CommandBuilder[];
export declare type CommandBuilderOptions = CommandBuilderOption[];
export {};
//# sourceMappingURL=commandBuilder.d.ts.map