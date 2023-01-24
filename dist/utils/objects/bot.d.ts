import { Client, Collection, ClientEvents } from "discord.js";
import { EventListeners } from "./eventListener.js";
import { ApplicationConfiguration } from "../../config/entities/applicationConfiguration.js";
import { DatabaseService } from "../../config/databaseService.js";
import { ModuleService } from "../../config/moduleService.js";
import { Module } from "../../modules/module.js";
export declare class Bot extends Client {
    private readonly projectConfiguration;
    private readonly databaseService;
    private readonly moduleConfiguration;
    private readonly logger;
    readonly events: Collection<keyof ClientEvents, EventListeners>;
    constructor(appConfig: ApplicationConfiguration, databaseService: DatabaseService, moduleConfiguration: ModuleService);
    init(): Promise<void>;
    run(): Promise<string>;
    stop(): Promise<void>;
    get modules(): Module[];
}
//# sourceMappingURL=bot.d.ts.map