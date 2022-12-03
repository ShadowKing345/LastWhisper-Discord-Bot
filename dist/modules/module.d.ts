import { Timers } from "../utils/objects/timer.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { EventListeners } from "../utils/objects/eventListener.js";
import { Commands, Command } from "../utils/objects/command.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { pino } from "pino";
export declare abstract class Module {
    permissionManagerService: PermissionManagerService;
    protected logger: pino.Logger;
    moduleName: string;
    commands: Commands;
    eventListeners: EventListeners;
    timers: Timers;
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
        [key: string]: (...args: any[]) => Promise<InteractionResponse | void>;
    };
    protected constructor(permissionManagerService: PermissionManagerService, logger: pino.Logger);
    protected commandResolver(interaction: ChatInputCommandInteraction, call?: boolean): Promise<void | InteractionResponse<boolean>> | ((...args: any[]) => Promise<void | InteractionResponse<boolean>>);
    hasCommand(command: string): boolean;
    getCommand(command: string): Command | undefined;
    get handlesCommands(): boolean;
    get handlesButtons(): boolean;
    get handlesSelectMenu(): boolean;
}
//# sourceMappingURL=module.d.ts.map