import { ToJsonBase } from "../objects/toJsonBase.js";
/**
 * Configuration object for the module configuration service.
 */
export class ModuleConfiguration extends ToJsonBase {
    // Disables all commands.
    enableCommands = true;
    // Disables all event listeners.
    enableEventListeners = true;
    // Disables all timers.
    enableTimers = true;
    // Disables all interactions with the application. Will also disable commands as a result.
    enableInteractions = true;
    // A collection of module names to be filtered.
    modules = [];
    // Should the list be treated as a blacklist.
    blacklist = true;
}
//# sourceMappingURL=moduleConfiguration.js.map