import { Module } from "../modules/module.js";
import { Bot } from "../objects/bot.js";
import { SlashCommand, EventListener, Timer } from "../objects/index.js";
import { ModuleConfiguration } from "./entities/index.js";
import { CTR } from "../utils/commonTypes.js";
type CommandStruct<T> = {
    type: CTR<Module>;
    value: T;
};
export declare class ModuleService {
    private readonly moduleConfiguration;
    private static slashCommands;
    private static eventListeners;
    private static timers;
    private readonly intervalIds;
    private readonly moduleLogger;
    private readonly interactionLogger;
    private readonly eventLogger;
    constructor(moduleConfiguration?: ModuleConfiguration);
    private runEvent;
    private interactionEvent;
    configureModules(client: Bot): void;
    cleanup(): void;
    private callCallback;
    static registerSlashCommand(command: SlashCommand, type: CTR<Module>): void;
    static getSlashCommands(): CommandStruct<SlashCommand>[];
    static registerEventListener(listener: EventListener, type: CTR<Module>): void;
    static getEventListeners(): CommandStruct<EventListener>[];
    static registerTimer(timer: Timer, type: CTR<Module>): void;
    static getTimers(): CommandStruct<Timer>[];
}
export {};
//# sourceMappingURL=moduleService.d.ts.map