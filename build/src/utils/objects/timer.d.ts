import { Client as DiscordClient } from "discord.js";
import { Client } from "../models/client.js";
/**
 * A representation of a timer for a module.
 */
export declare class Timer {
    name: string;
    timeout: number;
    execute: (client: Client) => Promise<void>;
    /**
     * Function that waits till the client is ready then simply exits.
     * This is meant to be a more standard way to do this wait for syntax.
     * @param client The client application.
     * @param checkAgainTime How long to wait before checking again. (Default 500ms).
     */
    static waitTillReady(client: DiscordClient, checkAgainTime?: number): Promise<void>;
}
export declare type Timers = Timer[];
//# sourceMappingURL=timer.d.ts.map