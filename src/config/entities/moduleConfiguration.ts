import { isArray } from "../../utils/index.js";

/**
 * Configuration object for the module configuration service.
 */
export class ModuleConfiguration {
    // Disables all commands.
    public enableCommands?: boolean = true;
    // Disables all event listeners.
    public enableEventListeners?: boolean = true;
    // Disables all timers.
    public enableTimers?: boolean = true;
    // Disables all interactions with the application. Will also disable commands as a result.
    public enableInteractions?: boolean = true;

    // A collection of module names to be filtered.
    public modules?: string[] = [ "DevModule" ];
    // Should the list be treated as a blacklist.
    public blacklist?: boolean = true;

    public merge( obj: Partial<ModuleConfiguration> ): ModuleConfiguration {
        if( obj.enableCommands !== undefined ) {
            this.enableCommands = obj.enableCommands;
        }

        if( obj.enableEventListeners !== undefined ) {
            this.enableEventListeners = obj.enableEventListeners;
        }

        if( obj.enableTimers !== undefined ) {
            this.enableTimers = obj.enableTimers;
        }

        if( obj.enableInteractions !== undefined ) {
            this.enableInteractions = obj.enableInteractions;
        }

        if( isArray( obj.modules ) ) {
            this.modules = obj.modules.filter( item => typeof item === "string" );
        }

        if( obj.blacklist !== undefined ) {
            this.blacklist = obj.blacklist;
        }

        return this;
    }
}
