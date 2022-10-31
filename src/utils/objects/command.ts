/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "./toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, ChatInputCommandInteraction, ApplicationCommandOptionType as OptionType, APIApplicationCommandOptionChoice } from "discord.js";
import { deepMerge } from "../index.js";

type SlashCommand = SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;

export class Command extends ToJsonBase<Command> {
    public name: string = null!;
    public description: string = null!;

    public execute: (interaction: ChatInputCommandInteraction) => Promise<any> = null!;
    public subcommands?: { [key: string]: Command };

    public options: CommandOptions = [];

    public constructor(data: Partial<Command> = null!) {
        super();
        if (data) {
            this.merge(data);
        }
    }

    public merge(obj: Partial<Command>): Command {
        if (obj.name) {
            this.name = obj.name;
        }

        if (obj.description) {
            this.description = obj.description;
        }

        if (obj.subcommands) {
            if (!this.subcommands) {
                this.subcommands = {};
            }

            for (const key in obj.subcommands) {
                this.subcommands[key] = deepMerge(this.subcommands[key] ?? new Command(), obj.subcommands[key]);
            }
        }

        if (obj.execute) {
            this.execute = obj.execute;
        }

        if (obj.options) {
            this.options = obj.options;
            this.options = (this.options ?? []).map(option => deepMerge(new CommandOption, option));
        }

        return this;
    }

    public build(builder: SlashCommand = new SlashCommandBuilder()): SlashCommand {
        builder.setName(this.name).setDescription(this.description);

        if (this.subcommands) {
            for (const subcommand of Object.values(this.subcommands)) {
                if (!subcommand) {
                    continue;
                }

                if (Object.values(subcommand.subcommands ?? []).length > 0 && builder instanceof SlashCommandBuilder) {
                    builder.addSubcommandGroup(subcommandGroupBuilder => subcommand.build(subcommandGroupBuilder) as SlashCommandSubcommandGroupBuilder);
                } else if (!(builder instanceof SlashCommandSubcommandBuilder)) {
                    builder.addSubcommand(subcommandBuilder => subcommand.build(subcommandBuilder) as SlashCommandSubcommandBuilder);
                }
            }
        }

        if (this.options && !(builder instanceof SlashCommandSubcommandGroupBuilder)) {
            for (const option of this.options) {
                option.build(builder);
            }
        }

        return builder;
    }
}

export class CommandOption extends ToJsonBase<CommandOption> {
    public name: string = null!;
    public description: string = null!;
    public type: OptionType = null!;
    public required: boolean = false;

    public choices: APIApplicationCommandOptionChoice<any>[] = [];

    public constructor(data: Partial<CommandOption> = null!) {
        super();

        if (data) {
            this.merge(data);
        }
    }

    public build(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder) {
        const cb = (optionBuilder: any) => {
            optionBuilder.setName(this.name).setDescription(this.description).setRequired(this.required);

            if (this.choices && "addChoices" in optionBuilder) {
                optionBuilder.addChoices(...this.choices);
            }

            return optionBuilder;
        };

        switch (this.type) {
            case OptionType.String:
                builder.addStringOption(cb);
                break;
            case OptionType.Integer:
                builder.addIntegerOption(cb);
                break;
            case OptionType.Boolean:
                builder.addBooleanOption(cb);
                break;
            case OptionType.User:
                builder.addUserOption(cb);
                break;
            case OptionType.Channel:
                builder.addChannelOption(cb);
                break;
            case OptionType.Role:
                builder.addRoleOption(cb);
                break;
            case OptionType.Mentionable:
                builder.addMentionableOption(cb);
                break;
            case OptionType.Number:
                builder.addNumberOption(cb);
                break;
            case OptionType.Attachment:
                builder.addAttachmentOption(cb);
                break;
            case OptionType.Subcommand:
            case OptionType.SubcommandGroup:
                throw new Error("You cannot set a option to be of type Subcommand or SubcommandGroup.");
            default:
                break;
        }

        return builder;
    }

    public merge(obj: Partial<CommandOption>): CommandOption {
        if (obj.name) {
            this.name = obj.name;
        }

        if (obj.description) {
            this.description = obj.description;
        }

        if (obj.type) {
            this.type = obj.type;
        }

        if (obj.required) {
            this.required = obj.required;
        }

        if (obj.choices) {
            this.choices = obj.choices;
        }

        return this;
    }
}

export type Commands = Command[];
export type CommandOptions = CommandOption[];