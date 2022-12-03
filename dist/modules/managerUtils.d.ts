import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "../utils/objects/index.js";
import { ManagerUtilsService } from "../services/managerUtils.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
import { EventListeners } from "../utils/objects/eventListener.js";
export declare class ManagerUtilsModule extends Module {
    private managerUtilsService;
    moduleName: string;
    commands: Commands;
    eventListeners: EventListeners;
    protected commandResolverKeys: {
        "manager_utils.clear": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    constructor(managerUtilsService: ManagerUtilsService, permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private onMemberRemoved;
    private onMemberBanned;
    private clear;
}
//# sourceMappingURL=managerUtils.d.ts.map