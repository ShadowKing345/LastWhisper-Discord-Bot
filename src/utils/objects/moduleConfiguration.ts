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
  public modules?: string[] = [];
  // Should the list be treated as a blacklist.
  public blacklist?: boolean = true;
}
