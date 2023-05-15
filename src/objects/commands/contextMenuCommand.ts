import { ContextMenuCommandBuilder, ContextMenuCommandType } from "discord.js";
import { Command } from "./command.js";

export class ContextMenuCommand extends Command {
    public type: ContextMenuCommandType;

    public constructor( data: Partial<ContextMenuCommand> = null ) {
        super();

        if( data ) {
            this.merge( data );
        }
    }

    public merge( obj: Partial<ContextMenuCommand> ): ContextMenuCommand {
        super.merge( obj );

        if( obj.type && typeof obj.type === "number" ) {
            this.type = obj.type;
        }
        
        return this;
    }

    public build(): unknown {
        return new ContextMenuCommandBuilder()
            .setName( this.name )
            .setType( this.type )
            .toJSON();
    }
}

export type ContextMenuCommands = ContextMenuCommand[];