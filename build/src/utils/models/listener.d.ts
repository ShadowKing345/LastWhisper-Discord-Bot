import { ClientEvents } from "discord.js";
import { Client } from "./client.js";
export declare class Listener {
    event: keyof ClientEvents;
    run: (client: Client, ...args: any[]) => Awaited<void>;
}
//# sourceMappingURL=listener.d.ts.map