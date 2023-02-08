import { Client } from "discord.js";
export declare class Bot extends Client {
    private readonly appToken;
    private readonly moduleService;
    private readonly logger;
    constructor();
    init(): Promise<void>;
    run(): Promise<string>;
    stop(): Promise<void>;
}
//# sourceMappingURL=bot.d.ts.map