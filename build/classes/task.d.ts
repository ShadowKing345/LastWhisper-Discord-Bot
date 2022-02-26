import { Client } from "./client.js";
import { Client as DiscordClient } from "discord.js";
export declare class Task {
    name: string;
    timeout: number;
    run: (client: Client) => Promise<void>;
    static waitTillReady(client: DiscordClient, checkAgainTime?: number): Promise<void>;
}
