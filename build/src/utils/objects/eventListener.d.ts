import { ClientEvents } from "discord.js";
import { Client } from "../models/client.js";
/**
 * A representation of an event listener for a module.
 */
export declare class EventListener<T extends keyof ClientEvents> {
    event: T;
    execute: (client: Client, ...args: ClientEvents[T]) => Promise<void>;
    constructor(event?: T, run?: (client: Client, ...args: ClientEvents[T]) => Promise<void>);
}
export declare type EventListeners = EventListener<any>[];
//# sourceMappingURL=eventListener.d.ts.map