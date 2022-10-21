import { Task } from "../models/task.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
import { EventListeners } from "../models/index.js";
import { CommandBuilders, CommandBuilder } from "./commandBuilder.js";
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
    eventListeners: EventListeners;
    tasks: Task[];
    buttons: {
        [key: string]: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    selectMenus: {
        [key: string]: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    modalSubmits: {
        [key: string]: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
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
    /**
     * Checks if the command with a given name is contained inside this object.
     * @param command The name of the command.
     */
    hasCommand(command: string): boolean;
    /**
     * Returns the first instance of a command with the given name.
     * @param command The name of the command.
     */
    getCommand(command: string): CommandBuilder | undefined;
    get handlesCommands(): boolean;
    get handlesButtons(): boolean;
    get handlesSelectMenu(): boolean;
}
//# sourceMappingURL=moduleBase.d.ts.map