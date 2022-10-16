/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "./toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, ApplicationCommandOptionType as OptionType } from "discord.js";
import { deepMerge } from "../index.js";
export class CommandBuilder extends ToJsonBase {
    name;
    description;
    execute;
    subcommands;
    options = [];
    constructor(data = null) {
        super();
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
                this.subcommands[key] = deepMerge(this.subcommands[key] ?? new CommandBuilder(), obj.subcommands[key]);
            }
        }
        if (obj.execute) {
            this.execute = obj.execute;
        }
        if (obj.options) {
            this.options = obj.options;
            this.options = (this.options ?? []).map(option => deepMerge(new CommandBuilderOption, option));
        }
        return this;
    }
    build(builder = new SlashCommandBuilder()) {
        builder.setName(this.name).setDescription(this.description);
        if (this.subcommands) {
            for (const subcommand of Object.values(this.subcommands)) {
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
export class CommandBuilderOption extends ToJsonBase {
    name;
    description;
    type;
    required = false;
    choices = [];
    constructor(data = null) {
        super();
        if (data) {
            this.merge(data);
        }
    }
    build(builder) {
        const cb = (optionBuilder) => {
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
//# sourceMappingURL=commandBuilder.js.map