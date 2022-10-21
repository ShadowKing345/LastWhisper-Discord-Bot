import { ClientEvents } from "discord.js";
import { Client } from "./client.js";
/**
 * A representation of an event listener for a module.
 */
export declare class EventListener {
    event: keyof ClientEvents;
    run: (client: Client, ...args: any[]) => Promise<void>;
    constructor(event?: keyof ClientEvents, run?: (client: Client, ...args: any[]) => Promise<void>);
}
export declare type EventListeners = EventListener[];
//# sourceMappingURL=eventListener.d.ts.map