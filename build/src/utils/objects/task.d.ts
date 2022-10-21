import { Client as DiscordClient } from "discord.js";
import { Client } from "../models/client.js";
export declare class Task {
    name: string;
    timeout: number;
    run: (client: Client) => Promise<void>;
    static waitTillReady(client: DiscordClient, checkAgainTime?: number): Promise<void>;
}
//# sourceMappingURL=task.d.ts.map