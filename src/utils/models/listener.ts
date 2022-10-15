import { ClientEvents } from "discord.js";

import { Client } from "./client.js";

/**
 * A representation of an event listener for a module.
 */
export class Listener {
    // The name of the event to listen to.
    public event: keyof ClientEvents;
    // Function to be called when the event is executed.
    public run: (client: Client, ...args: any[]) => Promise<void>;

    public constructor(event: keyof ClientEvents = null, run: (client: Client, ...args: any[]) => Promise<void> = null) {
        this.event = event
        this.run = run;
    }
}
