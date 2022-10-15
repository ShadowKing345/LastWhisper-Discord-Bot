import { ToJsonBase } from "../objects/toJsonBase.js";

/**
 * Configuration object for the module configuration service.
 */
export class ModuleConfiguration extends ToJsonBase<ModuleConfiguration> {
    // Disables all commands.
    public disableCommands?: boolean = false;
    // Disables all event listeners.
    public disableEventListeners?: boolean = false;
    // Disables all timers.
    public disableTimers?: boolean = false;
    // Disables all interactions with the application. Will also disable commands as a result.
    public disableInteractions?: boolean = false;

    // A collection of module names to be filtered.
    public modules?: string[] = [];
    // Should the list be treated as a blacklist.
    public blacklist?: boolean = true;
}