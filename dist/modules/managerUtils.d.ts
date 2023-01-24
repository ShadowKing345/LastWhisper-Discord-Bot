import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "./module.js";
import { ManagerUtilsService } from "../services/managerUtils.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Commands } from "../utils/objects/command.js";
import { EventListeners } from "../utils/objects/eventListener.js";
import { Logger } from "../config/logger.js";
export declare class ManagerUtilsModule extends Module {
    private managerUtilsService;
    protected logger: Logger;
    moduleName: string;
    commands: Commands;
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