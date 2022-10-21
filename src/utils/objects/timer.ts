import { Client as DiscordClient } from "discord.js";
import { Client } from "../models/client.js";

/**
 * A representation of a timer for a module.
 */
export class Timer {
    public name: string;
    public timeout: number;
    public execute: (client: Client) => Promise<void>;

    public static async waitTillReady(client: DiscordClient, checkAgainTime = 500) {
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
    }
}

export type Timers = Timer[];