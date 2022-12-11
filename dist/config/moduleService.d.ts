import { Bot } from "../utils/objects/bot.js";
import { Module, ProjectConfiguration } from "../utils/objects/index.js";
import { IOptional } from "../utils/optional/iOptional.js";
export declare class ModuleService {
    private readonly moduleConfiguration;
    private readonly intervalIds;
    private readonly _modules;
    private readonly moduleLogger;
    private readonly interactionLogger;
    private readonly eventLogger;
    private readonly taskLogger;
    constructor(config: IOptional<ProjectConfiguration>, modules: Module[]);
    private interactionEvent;
    private runEvent;
    private runTimer;
    configureModules(client: Bot): void;
    cleanup(): void;
    get modules(): Module[];
}
//# sourceMappingURL=moduleService.d.ts.map