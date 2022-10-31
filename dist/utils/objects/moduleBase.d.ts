import { Timers } from "./timer.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
import { EventListeners } from "./eventListener.js";
import { Commands, Command } from "./command.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { pino } from "pino";
export declare abstract class ModuleBase {
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
//# sourceMappingURL=moduleBase.d.ts.map