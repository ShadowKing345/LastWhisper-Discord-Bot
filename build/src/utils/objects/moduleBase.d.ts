import { Task } from "../models/task.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
import { EventListener } from "../models/index.js";
import { CommandBuilders } from "./commandBuilder.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { pino } from "pino";
/**
 * Base class for a module.
 */
export declare abstract class ModuleBase {
    permissionManagerService: PermissionManagerService;
    protected logger: pino.Logger;
    moduleName: string;
    commands: CommandBuilders;
    listeners: EventListener[];
    tasks: Task[];
    protected commandResolverKeys: {
        [key: string]: Function;
    };
    protected constructor(permissionManagerService: PermissionManagerService, logger: pino.Logger);
    /**
     * Method to resolve a slash command call from the discord client.
     * Will throw an error if the function was not found.
     * @param interaction Interaction object.
     * @param call Flag to set if the object should be called or just returned.
     * @throws Error
     * @protected
     */
    protected commandResolver(interaction: ChatInputCommandInteraction, call?: boolean): Promise<InteractionResponse | void | Function>;
}
//# sourceMappingURL=moduleBase.d.ts.map