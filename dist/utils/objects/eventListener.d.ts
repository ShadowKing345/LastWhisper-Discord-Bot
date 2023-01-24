import { ClientEvents } from "discord.js";
import { Bot } from "./bot.js";
export declare class EventListener<T extends keyof ClientEvents> {
    event: T;
    execute: (client: Bot, args: ClientEvents[T]) => Promise<void>;
    constructor(event?: T, run?: (client: Bot, args: ClientEvents[T]) => Promise<void>);
}
export type EventListeners = Array<EventListener<any>>;
//# sourceMappingURL=eventListener.d.ts.map