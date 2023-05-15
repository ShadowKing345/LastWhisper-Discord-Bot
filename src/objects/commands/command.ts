import { CommandInteraction } from "discord.js";
import { isStringNullOrEmpty } from "../../utils/index.js";

export abstract class Command {
    public name: string = null;
    public description: string = null;

    public callback: <T extends CommandInteraction>( interaction: T ) => Promise<unknown> | unknown = null;

    protected constructor( data: Partial<Command> = null ) {
        if( data ) {
            this.merge( data );
        }
    }

    public merge( obj: Partial<Command> ): Command {
        if( !isStringNullOrEmpty( obj.name ) ) {
            this.name = obj.name;
        }

        if( !isStringNullOrEmpty( obj.description ) ) {
            this.description = obj.description;
        }

        if( obj.callback ) {
            this.callback = obj.callback;
        }

        return this;
    }

    public abstract build(): unknown;
}

export type Commands = Command[];