import { Timers } from "../objects/timer.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { EventListeners, SlashCommand, SlashCommands } from "../objects/index.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Logger } from "../config/logger.js";
export declare abstract class Module {
    permissionManagerService: PermissionManagerService;
    protected logger: Logger;
    moduleName: string;
    commands: SlashCommands;
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
    protected constructor(permissionManagerService: PermissionManagerService);
    protected commandResolver(interaction: ChatInputCommandInteraction, call?: boolean): Promise<void | InteractionResponse<boolean>> | ((...args: any[]) => Promise<void | InteractionResponse<boolean>>);
    hasCommand(command: string): boolean;
    getCommand(command: string): SlashCommand | undefined;
    get handlesCommands(): boolean;
    get handlesButtons(): boolean;
    get handlesSelectMenu(): boolean;
}
//# sourceMappingURL=module.d.ts.map