import { ClientEvents } from "discord.js";

import { Client } from "../models/client.js";

/**
 * A representation of an event listener for a module.
 */
export class EventListener<T extends keyof ClientEvents> {
    // The name of the event to listen to.
    public event: T;
    // Function to be called when the event is executed.
    public execute: (client: Client, ...args: ClientEvents[T]) => Promise<void>;

    public constructor(event: T = null, run: (client: Client, ...args: ClientEvents[T]) => Promise<void> = null) {
        this.event = event;
        this.execute = run;
    }
}

export type EventListeners = EventListener<any>[];