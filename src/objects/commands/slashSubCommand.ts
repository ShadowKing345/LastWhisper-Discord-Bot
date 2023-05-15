import { SlashCommandSubcommandBuilder } from "discord.js";
import { Command } from "./command.js";
import { CommandOption, CommandOptions } from "./commandOption.js";

export class SlashSubCommand extends Command {
    public options: ( CommandOptions | Partial<CommandOption> )[] = [];

    public constructor( data: Partial<SlashSubCommand> = null ) {
        super();

        if( data ) {
            this.merge( data );
        }
    }

    public build( builder: SlashCommandSubcommandBuilder = new SlashCommandSubcommandBuilder() ): SlashCommandSubcommandBuilder {
        builder.setName( this.name ).setDescription( this.description );

        if( this.options ) {
            for( const option of this.options ) {
                if( option instanceof CommandOption ) {
                    option.build( builder );
                } else {
                    new CommandOption( option as Partial<CommandOption> ).build( builder );
                }
            }
        }

        return builder;
    }

    public merge( obj: Partial<SlashSubCommand> ): SlashSubCommand {
        super.merge( obj );

        if( obj.options ) {
            this.options = obj.options.map( option => option instanceof CommandOption ? option : new CommandOption( option as Partial<CommandOption> ) );
        }

        return this;
    }
}