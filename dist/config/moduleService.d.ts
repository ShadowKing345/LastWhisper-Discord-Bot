import { Module } from "../modules/module.js";
import { Bot } from "../objects/bot.js";
import { SlashCommand } from "../objects/slashCommand.js";
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
    private interactionEvent;
    private runEvent;
    private runTimer;
    configureModules(client: Bot): void;
    cleanup(): void;
    get filteredModules(): Module[];
    static registerCommand(command: SlashCommand, type: symbol): void;
}
//# sourceMappingURL=moduleService.d.ts.map