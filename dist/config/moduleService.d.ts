import { Module } from "../modules/module.js";
import { Bot } from "../objects/bot.js";
import { SlashCommand } from "../objects/index.js";
import { ModuleConfiguration } from "./entities/index.js";
export declare class ModuleService {
    private readonly moduleConfiguration;
    private static commands;
    private readonly intervalIds;
    private readonly moduleLogger;
    private readonly interactionLogger;
    private readonly eventLogger;
    private readonly taskLogger;
    constructor(moduleConfiguration?: ModuleConfiguration);
    get filteredModules(): Module[];
    private runEvent;
    private interactionEvent;
    private runTimer;
    configureModules(client: Bot): void;
    cleanup(): void;
    static registerCommand(command: SlashCommand, type: string): void;
}
//# sourceMappingURL=moduleService.d.ts.map