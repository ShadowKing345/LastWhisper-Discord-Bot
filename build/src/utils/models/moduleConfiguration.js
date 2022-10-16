import { ToJsonBase } from "../objects/toJsonBase.js";
/**
 * Configuration object for the module configuration service.
 */
export class ModuleConfiguration extends ToJsonBase {
    // Disables all commands.
    disableCommands = false;
    // Disables all event listeners.
    disableEventListeners = false;
    // Disables all timers.
    disableTimers = false;
    // Disables all interactions with the application. Will also disable commands as a result.
    disableInteractions = false;
    // A collection of module names to be filtered.
    modules = [];
    // Should the list be treated as a blacklist.
    blacklist = true;
}
//# sourceMappingURL=moduleConfiguration.js.map