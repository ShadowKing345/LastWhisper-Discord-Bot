import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType as OptionType, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, } from "discord.js";
import { deepMerge } from "../utils/index.js";
export class SlashCommand {
    name = null;
    description = null;
    callback = null;
    subcommands;
    options = [];
    constructor(data = null) {
        if (data) {
            this.merge(data);
        }
    }
    merge(obj) {
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
                this.subcommands[key] = deepMerge(this.subcommands[key] ?? new SlashCommand(), obj.subcommands[key]);
            }
        }
        if (obj.callback) {
            this.callback = obj.callback;
        }
        if (obj.options) {
            this.options = obj.options;
            this.options = (this.options ?? []).map(option => deepMerge(new CommandOption(), option));
        }
        return this;
    }
    build(builder = new SlashCommandBuilder()) {
        builder.setName(this.name).setDescription(this.description);
        if (this.subcommands) {
            for (const subcommand of Object.values(this.subcommands)) {
                if (!subcommand) {
                    continue;
                }
                if (Object.values(subcommand.subcommands ?? []).length > 0 && builder instanceof SlashCommandBuilder) {
                    builder.addSubcommandGroup(subcommandGroupBuilder => subcommand.build(subcommandGroupBuilder));
                }
                else if (!(builder instanceof SlashCommandSubcommandBuilder)) {
                    builder.addSubcommand(subcommandBuilder => subcommand.build(subcommandBuilder));
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
export class CommandOption {
    name = null;
    description = null;
    type = null;
    required = false;
    choices = [];
    constructor(data = null) {
        if (data) {
            this.merge(data);
        }
    }
    buildOptionCallback(optionBuilder) {
        optionBuilder.setName(this.name).setDescription(this.description).setRequired(this.required);
        if (this.choices && optionBuilder instanceof SlashCommandStringOption) {
            optionBuilder.addChoices(...this.choices);
        }
        return optionBuilder;
    }
    build(builder) {
        switch (this.type) {
            case OptionType.String:
                builder.addStringOption(this.buildOptionCallback.bind(this));
                break;
            case OptionType.Integer:
                builder.addIntegerOption(this.buildOptionCallback.bind(this));
                break;
            case OptionType.Boolean:
                builder.addBooleanOption(this.buildOptionCallback.bind(this));
                break;
            case OptionType.User:
                builder.addUserOption(this.buildOptionCallback.bind(this));
                break;
            case OptionType.Channel:
                builder.addChannelOption(this.buildOptionCallback.bind(this));
                break;
            case OptionType.Role:
                builder.addRoleOption(this.buildOptionCallback.bind(this));
                break;
            case OptionType.Mentionable:
                builder.addMentionableOption(this.buildOptionCallback.bind(this));
                break;
            case OptionType.Number:
                builder.addNumberOption(this.buildOptionCallback.bind(this));
                break;
            case OptionType.Attachment:
                builder.addAttachmentOption(this.buildOptionCallback.bind(this));
                break;
            case OptionType.Subcommand:
            case OptionType.SubcommandGroup:
                throw new Error("You cannot set a option to be of type Subcommand or SubcommandGroup.");
            default:
                break;
        }
        return builder;
    }
    merge(obj) {
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
//# sourceMappingURL=slashCommand.js.map