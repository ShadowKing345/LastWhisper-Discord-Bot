import { CommandInteraction, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { isArray } from "../../utils/index.js";
import { Command } from "./command.js";
import { CommandNameDef } from "./slashCommand.js";
import { SlashSubCommand } from "./slashSubCommand.js";

export class SlashGroupCommand extends Command {
    public subcommands: ( SlashSubCommand | Partial<SlashSubCommand> )[];

    public constructor( data: Partial<SlashGroupCommand> = null ) {
        super();

        if( data ) {
            this.merge( data );
        }
    }

    public build( builder: SlashCommandSubcommandGroupBuilder = new SlashCommandSubcommandGroupBuilder() ): SlashCommandSubcommandGroupBuilder {
        builder.setName( this.name ).setDescription( this.description );

        for( const subcommand of this.subcommands ) {
            builder.addSubcommand( subCommandBuilder => subcommand.build( subCommandBuilder ) );
        }

        return builder;
    }

    public getCallback( def: CommandNameDef ): ( interaction: CommandInteraction ) => ( Promise<unknown> | unknown ) {
        if( this.callback ) {
            return this.callback;
        }

        if( this.subcommands.length <= 0 ) {
            throw new Error( "No subcommands can be found." );
        }

        const subCommand = this.subcommands.find( item => item.name === def.sub );
        if( !subCommand ) {
            throw new Error( "No subcommand could be found." );
        }

        if( !subCommand.callback ) {
            throw new Error( "Subcommand does not have a callback." );
        }

        return subCommand.callback;
    }

    public merge( obj: Partial<SlashGroupCommand> ): SlashGroupCommand {
        super.merge( obj );

        if( obj.subcommands && isArray( obj.subcommands ) ) {
            this.subcommands = obj.subcommands.map( item => item instanceof SlashSubCommand ? item : new SlashSubCommand( item ) );
        }

        return this;
    }
}