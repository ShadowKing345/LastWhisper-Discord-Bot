import { Module } from "../modules/module.js";
import { Bot } from "../objects/bot.js";
import { SlashCommand } from "../objects/index.js";
import { ModuleConfiguration } from "./entities/index.js";
import { CTR } from "../utils/commonTypes.js";
export declare class ModuleService {
    private readonly moduleConfiguration;
    private static commands;
    private readonly intervalIds;
    private readonly moduleLogger;
    private readonly interactionLogger;
    constructor(moduleConfiguration?: ModuleConfiguration);
    get filteredModules(): Module[];
    private interactionEvent;
    configureModules(client: Bot): void;
    cleanup(): void;
    private callCallback;
    static registerCommand<T extends Module>(command: SlashCommand, type: CTR<T>): void;
}
//# sourceMappingURL=moduleService.d.ts.map