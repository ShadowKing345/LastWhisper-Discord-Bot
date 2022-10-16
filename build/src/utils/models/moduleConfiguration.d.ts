import { ToJsonBase } from "../objects/toJsonBase.js";
/**
 * Configuration object for the module configuration service.
 */
export declare class ModuleConfiguration extends ToJsonBase<ModuleConfiguration> {
    disableCommands?: boolean;
    disableEventListeners?: boolean;
    disableTimers?: boolean;
    disableInteractions?: boolean;
    modules?: string[];
    blacklist?: boolean;
}
//# sourceMappingURL=moduleConfiguration.d.ts.map