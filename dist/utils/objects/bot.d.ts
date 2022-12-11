import { Client, Collection, ClientEvents } from "discord.js";
import { EventListeners } from "./eventListener.js";
import { ProjectConfiguration } from "./projectConfiguration.js";
import { DatabaseService } from "../../config/databaseService.js";
import { ModuleService } from "../../config/moduleService.js";
import { Module } from "../../modules/module.js";
import { IOptional } from "../optional/iOptional.js";
export declare class Bot extends Client {
    private readonly projectConfiguration;
    private readonly databaseService;
    private readonly moduleConfiguration;
    private readonly logger;
    readonly events: Collection<keyof ClientEvents, EventListeners>;
    constructor(appConfig: IOptional<ProjectConfiguration>, databaseService: DatabaseService, moduleConfiguration: ModuleService);
    init(): Promise<void>;
    run(): Promise<string>;
    stop(): Promise<void>;
    get modules(): Module[];
}
//# sourceMappingURL=bot.d.ts.map