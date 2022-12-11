import { LoggerService } from "../services/loggerService.js";
import { Bot } from "../utils/objects/bot.js";
import { Module, ProjectConfiguration } from "../utils/objects/index.js";
export declare class ModuleConfigurationService {
    private readonly moduleConfiguration;
    private readonly intervalIds;
    private readonly _modules;
    private readonly moduleLogger;
    private readonly interactionLogger;
    private readonly eventLogger;
    private readonly taskLogger;
    constructor(config: ProjectConfiguration, modules: Module[], loggerFactory: LoggerService);
    private interactionEvent;
    private runEvent;
    private runTimer;
    configureModules(client: Bot): void;
    cleanup(): void;
    get modules(): Module[];
}
//# sourceMappingURL=moduleConfigurationService.d.ts.map