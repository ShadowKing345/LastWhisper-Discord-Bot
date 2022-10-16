import { ConfigurationClass } from "../configurationClass.js";
import { LoggerService } from "../loggerService.js";
import { Client } from "../models/client.js";
import { ModuleBase, ProjectConfiguration } from "../models/index.js";
/**
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
export declare class ModuleConfigurationService extends ConfigurationClass {
    private readonly moduleConfiguration;
    private readonly intervalIds;
    private readonly _modules;
    private readonly loggers;
    constructor(config: ProjectConfiguration, modules: ModuleBase[], loggerFactory: LoggerService);
    /**
     * Todo: Cleanup.
     * Todo: Setup modal responding.
     * Todo: Setup buttons/select menu
     * Todo: Context Menu.
     * The main interaction event callback function that is called when a Discord interaction event is called.
     * @param interaction The interaction data object.
     * @private
     */
    private interactionEvent;
    /**
     * Callback function when a general event other than the interaction event is called.
     * @param listeners A collection of all the listeners to this event.
     * @param client The main application client. Not to be confused with Discord.Js Client.
     * @param args Any additional arguments provided to the event.
     * @private
     */
    private runEvent;
    /**
     * Todo: Cleanup.
     * Function that sets up a Javascript timer to go off.
     * Also fires the timer as well.
     * @param task The timer object data used to create a timer.
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     * @private
     */
    private runTimer;
    /**
     * Todo: Cleanup.
     * Configures a client with all the necessary module and callback information.
     * Registers events, timers, commands, etc...
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     */
    configureModules(client: Client): void;
    /**
     * Cleanup function.
     */
    cleanup(): void;
    /**
     * List of all modules registered.
     */
    get modules(): ModuleBase[];
}
//# sourceMappingURL=moduleConfigurationService.d.ts.map