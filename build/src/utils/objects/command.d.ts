/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "./toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType as OptionType, APIApplicationCommandOptionChoice } from "discord.js";
declare type SlashCommand = SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;
export declare class Command extends ToJsonBase<Command> {
    name: string;
    description: string;
    execute?: (interaction: ChatInputCommandInteraction) => Promise<any>;
    subcommands?: {
        [key: string]: Partial<Command>;
    };
    options: CommandOptions;
    constructor(data?: Partial<Command>);
    merge(obj: Partial<Command>): Command;
    build(builder?: SlashCommand): SlashCommand;
}
export declare class CommandOption extends ToJsonBase<CommandOption> {
    name: string;
    description: string;
    type: OptionType;
    required: boolean;
    choices: APIApplicationCommandOptionChoice<any>[];
    constructor(data?: Partial<CommandOption>);
    build(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder): SlashCommandBuilder | SlashCommandSubcommandBuilder;
    merge(obj: Partial<CommandOption>): CommandOption;
}
export declare type Commands = Command[];
export declare type CommandOptions = CommandOption[];
export {};
//# sourceMappingURL=command.d.ts.map