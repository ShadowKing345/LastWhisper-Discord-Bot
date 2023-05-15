import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, } from "discord.js";
import { Command } from "./command.js";
import { CommandOption, CommandOptions } from "./commandOption.js";
import { SlashGroupCommand } from "./slashGroupCommand.js";
import { SlashSubCommand } from "./slashSubCommand.js";

export type CommandNameDef = { name?: string, group?: string, sub?: string };

/**
 * Object that represents a slash command to be used.
 */
export class SlashCommand extends Command {
    public subcommands?: ( SlashSubCommand | Partial<SlashSubCommand> | SlashGroupCommand | Partial<SlashGroupCommand> )[];

    public options: ( CommandOptions | Partial<CommandOption> )[] = [];

    public constructor( data: Partial<SlashCommand> = null ) {
        super();

        if( data ) {
            this.merge( data );
        }
    }

    public merge( obj: Partial<SlashCommand> ): SlashCommand {
        super.merge( obj );

        if( obj.subcommands ) {
            this.subcommands = obj.subcommands.map( item => {
                if( item instanceof SlashSubCommand || item instanceof SlashGroupCommand ) {
                    return item;
                }

                if( "options" in item ) {
                    return new SlashSubCommand( item );
                } else if( "subcommands" in item ) {
                    return new SlashGroupCommand( item );
                } else {
                    throw new Error( "Bad type" );
                }
            } );
        }

        if( obj.options ) {
            this.options = obj.options.map( option => option instanceof CommandOption ? option : new CommandOption( option as Partial<CommandOption> ) );
        }

        return this;
    }

    public build( builder: SlashCommandBuilder = new SlashCommandBuilder() ): unknown {
        builder.setName( this.name ).setDescription( this.description );
        
        if( this.subcommands ) {
            for( const subcommand of this.subcommands.filter( value => value ) ) {
                if( subcommand instanceof SlashGroupCommand ) {
                    builder.addSubcommandGroup( subcommandGroupBuilder => subcommand.build( subcommandGroupBuilder ) );
                    continue;
                }

                if( subcommand instanceof SlashSubCommand ) {
                    builder.addSubcommand( subcommandBuilder => subcommand.build( subcommandBuilder ) );
                }
            }
        }

        if( this.options ) {
            for( const option of this.options ) {
                if( option instanceof CommandOption ) {
                    option.build( builder );
                } else {
                    new CommandOption( option as Partial<CommandOption> ).build( builder );
                }
            }
        }

        return builder.toJSON();
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
            if( !( group && group instanceof SlashGroupCommand ) ) {
                throw new Error( "No group slash commands found." );
            }

            return group.getCallback( { name: def.group, sub: def.sub } );
        }

        if( def.sub ) {
            const sub = this.subcommands?.find( sub => sub.name === def.sub );
            if( !( sub && sub instanceof SlashSubCommand ) ) {
                throw new Error( "No sub slash commands found." );
            }

            if( !sub.callback ) {
                throw new Error( "This sub command does not have a callback set." );
            }

            return sub.callback;
        }

        return null;
    }
}

export type SlashCommands = SlashCommand[];
