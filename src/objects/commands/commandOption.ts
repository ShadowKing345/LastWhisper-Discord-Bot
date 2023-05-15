import { SlashCommandBuilder } from "@discordjs/builders";
import { APIApplicationCommandOptionChoice, ApplicationCommandOptionBase, SlashCommandStringOption, SlashCommandSubcommandBuilder, ApplicationCommandOptionType as OptionType } from "discord.js";

export class CommandOption {
    public name: string = null;
    public description: string = null;
    public type: OptionType = null;
    public required = false;

    public choices: APIApplicationCommandOptionChoice<unknown>[] = [];

    public constructor( data: Partial<CommandOption> = null ) {
        if( data ) {
            this.merge( data );
        }
    }

    public merge( obj: Partial<CommandOption> ): CommandOption {
        if( obj.name ) {
            this.name = obj.name;
        }

        if( obj.description ) {
            this.description = obj.description;
        }

        if( obj.type ) {
            this.type = obj.type;
        }

        if( obj.required ) {
            this.required = obj.required;
        }

        if( obj.choices ) {
            this.choices = obj.choices;
        }

        return this;
    }

    public build( builder: SlashCommandBuilder | SlashCommandSubcommandBuilder ) {
        switch( this.type ) {
            case OptionType.String:
                builder.addStringOption( this.buildOptionCallback.bind( this ) );
                break;
            case OptionType.Integer:
                builder.addIntegerOption( this.buildOptionCallback.bind( this ) );
                break;
            case OptionType.Boolean:
                builder.addBooleanOption( this.buildOptionCallback.bind( this ) );
                break;
            case OptionType.User:
                builder.addUserOption( this.buildOptionCallback.bind( this ) );
                break;
            case OptionType.Channel:
                builder.addChannelOption( this.buildOptionCallback.bind( this ) );
                break;
            case OptionType.Role:
                builder.addRoleOption( this.buildOptionCallback.bind( this ) );
                break;
            case OptionType.Mentionable:
                builder.addMentionableOption( this.buildOptionCallback.bind( this ) );
                break;
            case OptionType.Number:
                builder.addNumberOption( this.buildOptionCallback.bind( this ) );
                break;
            case OptionType.Attachment:
                builder.addAttachmentOption( this.buildOptionCallback.bind( this ) );
                break;
            case OptionType.Subcommand:
            case OptionType.SubcommandGroup:
                throw new Error( "You cannot set a option to be of type Subcommand or SubcommandGroup." );
            default:
                break;
        }

        return builder;
    }

    private buildOptionCallback<S extends ApplicationCommandOptionBase>( optionBuilder: S ): S {
        optionBuilder.setName( this.name ).setDescription( this.description ).setRequired( this.required );

        if( this.choices && optionBuilder instanceof SlashCommandStringOption ) {
            optionBuilder.addChoices( ...( this.choices as APIApplicationCommandOptionChoice<string>[] ) );
        }

        return optionBuilder;
    }
}

export type CommandOptions = CommandOption[];