import { PermissionManagerModule } from "../../permission_manager/index.js";
import { ConfigurationClass } from "../configuration.class.js";
import { LoggerService } from "../loggerService.js";
import { Client } from "../models/client.js";
import { ModuleBase } from "../models/index.js";
import { BuffManagerModule } from "../../modules/buffManager.module.js";
import { EventManagerModule } from "../../modules/eventManager.module.js";
import { GardeningManagerModule } from "../../modules/gardeningManager.module.js";
import { ManagerUtilsModule } from "../../modules/managerUtils.module.js";
import { RoleManagerModule } from "../../modules/roleManager.module.js";
/**
 * Todo: Cleanup.
 * Configuration service that manages the creation and registration of the different modules in the application.
 */
export declare class ModuleConfigurationService extends ConfigurationClass {
    private readonly intervalIds;
    private readonly _modules;
    private readonly loggers;
    constructor(buffManagerModule: BuffManagerModule, eventManagerModule: EventManagerModule, gardeningManagerModule: GardeningManagerModule, managerUtilsModule: ManagerUtilsModule, roleManagerModule: RoleManagerModule, permissionManagerModule: PermissionManagerModule, loggerFactory: LoggerService);
    /**
     * Todo: Cleanup.
     * The main interaction event callback function that is called when a Discord interaction event is called.
     * @param interaction The interaction data object.
     * @private
     */
    private interactionEvent;
    /**
     * Todo: Cleanup.
     * Callback function when a general event other than the interaction event is called.
     * @param listeners A collection of all the listeners to this event.
     * @param client The main application client. Not to be confused with Discord.Js Client.
     * @param args Any additional arguments provided to the event.
     * @private
     */
    private runEvent;
    /**
     * Todo: Rename to timer.
     * Todo: Cleanup.
     * Function to setup a Javascript timer to go off.
     * Also fires the timer as well.
     * @param task The timer object data used to create a timer.
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     * @private
     */
    private runTask;
    /**
     * Todo: Cleanup.
     * Configures a client with all the necessary module and callback information.
     * Registers events, timers, commands, etc...
     * @param client The main app client. Not to be confused with Discord.Js Client object.
     */
    configureModules(client: Client): void;
    /**
     * Todo: Cleanup.
     * Cleanup function.
     */
    cleanup(): void;
    /**
     * Todo: Cleanup.
     * List of all modules registered.
     */
    get modules(): ModuleBase[];
}
//# sourceMappingURL=moduleConfigurationService.d.ts.map