import { ClientEvents } from "discord.js";

import { Bot } from "./bot.js";

/**
 * A representation of an event listener for a module.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventListener<T extends keyof ClientEvents = any> {
  // The name of the event to listen to.
  public event: T;
  // Function to be called when the event is executed.
  public execute: (client: Bot, args: ClientEvents[T]) => Promise<void>;

  public constructor(event: T = null, run: (client: Bot, args: ClientEvents[T]) => Promise<void> = null) {
    this.event = event;
    this.execute = run;
  }
}

export type EventListeners = Array<EventListener>;
