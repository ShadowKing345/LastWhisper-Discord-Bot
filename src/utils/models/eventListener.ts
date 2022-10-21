import { ClientEvents } from "discord.js";

import { Client } from "./client.js";

/**
 * A representation of an event listener for a module.
 */
export class EventListener<T extends keyof ClientEvents> {
    // The name of the event to listen to.
    public readonly event: T;
    // Function to be called when the event is executed.
    public run: (client: Client, ...args: ClientEvents[T]) => Promise<void>;

    public constructor(event: T = null, run: (client: Client, ...args: ClientEvents[T]) => Promise<void> = null) {
        this.event = event;
        this.run = run;
    }
}

export type EventListeners = EventListener<any>[];