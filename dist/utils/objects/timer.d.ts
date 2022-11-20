import { Client as DiscordClient } from "discord.js";
import { Client } from "../models/client.js";
export declare class Timer {
    name: string;
    timeout: number;
    execute: (client: Client) => Promise<unknown>;
    static waitTillReady(client: DiscordClient, checkAgainTime?: number): Promise<void>;
}
export declare type Timers = Timer[];
//# sourceMappingURL=timer.d.ts.map