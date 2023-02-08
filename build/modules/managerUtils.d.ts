import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "./module.js";
import { ManagerUtilsService } from "../services/managerUtils.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { EventListeners, SlashCommands } from "../objects/index.js";
export declare class ManagerUtilsModule extends Module {
    private managerUtilsService;
    private static readonly logger;
    moduleName: string;
    commands: SlashCommands;
    eventListeners: EventListeners;
    protected commandResolverKeys: {
        "manager_utils.clear": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    constructor(managerUtilsService: ManagerUtilsService, permissionManagerService: PermissionManagerService);
    private onMemberRemoved;
    private onMemberBanned;
    private clear;
}
//# sourceMappingURL=managerUtils.d.ts.map