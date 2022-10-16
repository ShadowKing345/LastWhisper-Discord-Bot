/**
 * Class representation of a collection of permission keys.
 */
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { deepMerge } from "../../utils/index.js";

type SlashCommand = SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;

export class CommandBuilder extends ToJsonBase<CommandBuilder> {
    public name: string;
    public description: string;

    public subcommands?: { [key: string]: Partial<CommandBuilder> };

    public constructor(data: Partial<CommandBuilder> = null) {
        super();
        if (data) {
            this.merge(data as CommandBuilder);
        }
    }

    public merge(obj: CommandBuilder): CommandBuilder {
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

        return this;
    }

    public build(builder: SlashCommand = new SlashCommandBuilder()): SlashCommand {
        builder.setName(this.name).setDescription(this.description);

        if (this.subcommands) {
            for (const subcommand of Object.values(this.subcommands)) {
                if (Object.values(subcommand.subcommands ?? []).length > 0 && builder instanceof SlashCommandBuilder) {
                    builder.addSubcommandGroup(subcommandGroupBuilder => subcommand.build(subcommandGroupBuilder) as SlashCommandSubcommandGroupBuilder);
                } else if (!(builder instanceof SlashCommandSubcommandBuilder)) {
                    builder.addSubcommand(subcommandBuilder => subcommand.build(subcommandBuilder) as SlashCommandSubcommandBuilder);
                }
            }
        }

        return builder;
    }
}