import { ConfigurationClass } from "../configurationClass.js";
import { LoggerService } from "../loggerService.js";
import { Client } from "../models/client.js";
import { ModuleBase, ProjectConfiguration } from "../models/index.js";
export declare class ModuleConfigurationService extends ConfigurationClass {
    private readonly moduleConfiguration;
    private readonly intervalIds;
    private readonly _modules;
    private readonly moduleLogger;
    private readonly interactionLogger;
    private readonly eventLogger;
    private readonly taskLogger;
    constructor(config: ProjectConfiguration, modules: ModuleBase[], loggerFactory: LoggerService);
    private interactionEvent;
    private runEvent;
    private runTimer;
    configureModules(client: Client): void;
    cleanup(): void;
    get modules(): ModuleBase[];
}
//# sourceMappingURL=moduleConfigurationService.d.ts.map