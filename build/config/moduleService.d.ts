import { Module } from "../modules/module.js";
import { Bot } from "../objects/bot.js";
import { EventListener, SlashCommand, Timer } from "../objects/index.js";
import { ModuleConfiguration } from "./entities/index.js";
import { CTR } from "../utils/commonTypes.js";
type CommandStruct<T> = {
    type: CTR<Module>;
    value: T;
};
export declare class ModuleService {
    private readonly moduleConfiguration;
    private static readonly moduleServiceLogger;
    private static slashCommands;
    private static eventListeners;
    private static timers;
    private static readonly timerChildInstance;
    private readonly intervalIds;
    constructor(moduleConfiguration?: ModuleConfiguration);
    private runEvent;
    private interactionEvent;
    private runTimers;
    configureModules(client: Bot): Promise<void>;
    cleanup(): Promise<void>;
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