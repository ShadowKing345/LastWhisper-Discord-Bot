import { Client as DiscordClient, Collection, ClientEvents } from "discord.js";
import { EventListeners } from "../objects/eventListener.js";
export declare class Client extends DiscordClient {
    readonly events: Collection<keyof ClientEvents, EventListeners>;
    constructor();
}
//# sourceMappingURL=client.d.ts.map