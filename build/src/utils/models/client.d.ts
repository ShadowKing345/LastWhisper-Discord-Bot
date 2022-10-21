import { Client as DiscordClient, Collection, ClientEvents } from "discord.js";
import { EventListeners } from "./eventListener.js";
/**
 * Custom client class to hold the additional information about a discord client and the set-up flags.
 */
export declare class Client extends DiscordClient {
    readonly events: Collection<keyof ClientEvents, EventListeners>;
    constructor();
}
//# sourceMappingURL=client.d.ts.map