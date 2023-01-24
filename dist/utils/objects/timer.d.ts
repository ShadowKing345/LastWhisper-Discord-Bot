import { Client as DiscordClient } from "discord.js";
import { Bot } from "./bot.js";
export declare class Timer {
    name: string;
    timeout: number;
    execute: (client: Bot) => Promise<unknown>;
    static waitTillReady(client: DiscordClient, checkAgainTime?: number): Promise<void>;
}
export type Timers = Timer[];
//# sourceMappingURL=timer.d.ts.map