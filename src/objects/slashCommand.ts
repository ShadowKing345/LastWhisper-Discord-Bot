import { SlashCommandBuilder } from "@discordjs/builders";
import { APIApplicationCommandOptionChoice, ApplicationCommandOptionBase, ApplicationCommandOptionType as OptionType, ChatInputCommandInteraction, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, } from "discord.js";

type SlashCommandType = SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;

export type CommandNameDef = { name?: string, group?: string, sub?: string };

/**
 * Object that represents a slash command to be used.
 */
export class SlashCommand {
    public name: string = null;
    public description: string = null;

    public callback: ( interaction: ChatInputCommandInteraction ) => Promise<unknown> | unknown = null;
    public subcommands?: ( SlashCommand | Partial<SlashCommand> )[];

    public options: CommandOptions = [];

    public constructor( data: Partial<SlashCommand> = null ) {
        if( data ) {
            this.merge( data );
        }
    }

    public merge( obj: Partial<SlashCommand> ): SlashCommand {
        if( obj.name ) {
            this.name = obj.name;
        }

        if( obj.description ) {
            this.description = obj.description;
        }

        if( obj.subcommands ) {
            this.subcommands = obj.subcommands.map( item => item instanceof SlashCommand ? item : new SlashCommand( item ) );
        }

        if( obj.callback ) {
            this.callback = obj.callback;
        }

        if( obj.options ) {
            this.options = obj.options.map( option => option instanceof CommandOption ? option : new CommandOption( option ) );
        }

        return this;
    }

    public build( builder: SlashCommandType = new SlashCommandBuilder() ): SlashCommandType {
        builder.setName( this.name ).setDescription( this.description );

        if( this.subcommands ) {
            for( const subcommand of this.subcommands ) {
                if( !subcommand ) {
                    continue;
                }

                if( subcommand.subcommands?.length > 0 && builder instanceof SlashCommandBuilder ) {
                    builder.addSubcommandGroup( subcommandGroupBuilder => subcommand.build( subcommandGroupBuilder ) as SlashCommandSubcommandGroupBuilder, );
                } else if( !( builder instanceof SlashCommandSubcommandBuilder ) ) {
                    builder.addSubcommand( subcommandBuilder => subcommand.build( subcommandBuilder ) as SlashCommandSubcommandBuilder, );
                }
            }
        }

        if( this.options && !( builder instanceof SlashCommandSubcommandGroupBuilder ) ) {
            for( const option of this.options ) {
                option.build( builder );
            }
        }

        return builder;
    }

    public getCallback( def: CommandNameDef ): ( interaction: ChatInputCommandInteraction ) => Promise<unknown> | unknown {
        if( this.callback ) {
            return this.callback;
        }

        if( this.subcommands?.length < 1 ) {
            throw new Error( "Command does not have subcommands." );
        }

        if( def.group ) {
            if( !def.sub ) {
                throw new Error( "Attempting to look for a subGroup command without a subCommand should not be possible." );
            }

            const group = this.subcommands?.find( group => group.name === def.group );
            if( group ) {
                return group.getCallback( { name: def.group, sub: def.sub } );
            }
        }

        if( def.sub ) {
            const sub = this.subcommands?.find( sub => sub.name === def.sub );
            if( sub && sub.callback ) {
                return sub.callback;
            }
        }

        return null;
    }
}

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

    private buildOptionCallback<S extends ApplicationCommandOptionBase>( optionBuilder: S ): S {
        optionBuilder.setName( this.name ).setDescription( this.description ).setRequired( this.required );

        if( this.choices && optionBuilder instanceof SlashCommandStringOption ) {
            optionBuilder.addChoices( ...( this.choices as APIApplicationCommandOptionChoice<string>[] ) );
        }

        return optionBuilder;
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
}

export type SlashCommands = SlashCommand[];
export type CommandOptions = CommandOption[];
