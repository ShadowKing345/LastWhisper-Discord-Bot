import { Client as DiscordClient } from "discord.js";
import { Bot } from "./bot.js";

/**
 * A representation of a timer for a module.
 */
export class Timer {
    public name: string = null;
    public timeout: number = null;
    public execute: ( client: Bot ) => Promise<unknown> = null;

    public constructor( data: Partial<Timer> = null ) {
        if( data ) {
            this.merge( data );
        }
    }

    public merge( obj: Partial<Timer> ): this {
        if( obj.name ) {
            this.name = obj.name;
        }

        if( obj.timeout ) {
            this.timeout = obj.timeout;
        }

        if( obj.execute ) {
            this.execute = obj.execute;
        }

        return this;
    }

    /**
     * Function that waits till the client is ready then simply exits.
     * This is meant to be a more standard way to do this wait for syntax.
     * @param client The client application.
     * @param checkAgainTime How long to wait before checking again. (Default 500ms).
     */
    public static async waitTillReady( client: DiscordClient, checkAgainTime = 500 ) {
        while( !client.isReady() ) {
            await new Promise( resolve => setTimeout( resolve, checkAgainTime ) );
        }
    }
}

export type Timers = Timer[];
