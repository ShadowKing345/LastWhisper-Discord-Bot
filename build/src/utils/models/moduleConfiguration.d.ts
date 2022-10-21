import { ToJsonBase } from "../objects/toJsonBase.js";
/**
 * Configuration object for the module configuration service.
 */
export declare class ModuleConfiguration extends ToJsonBase<ModuleConfiguration> {
    enableCommands?: boolean;
    enableEventListeners?: boolean;
    enableTimers?: boolean;
    enableInteractions?: boolean;
    modules?: string[];
    blacklist?: boolean;
}
//# sourceMappingURL=moduleConfiguration.d.ts.map