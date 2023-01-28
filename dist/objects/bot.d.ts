import { Client, ClientEvents, Collection } from "discord.js";
import { EventListeners } from "./eventListener.js";
export declare class Bot extends Client {
    private readonly appToken;
    private readonly databaseService;
    private readonly moduleService;
    private readonly logger;
    readonly events: Collection<keyof ClientEvents, EventListeners>;
    constructor();
    init(): void;
    run(): Promise<string>;
    stop(): Promise<void>;
}
//# sourceMappingURL=bot.d.ts.map