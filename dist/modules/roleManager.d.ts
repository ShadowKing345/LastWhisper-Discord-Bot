import { InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { Module } from "./module.js";
import { RoleManagerService } from "../services/roleManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Commands } from "../utils/objects/command.js";
import { EventListeners } from "../utils/objects/eventListener.js";
import { Logger } from "../config/logger.js";
export declare class RoleManagerModule extends Module {
    private roleManagerService;
    protected logger: Logger;
    moduleName: string;
    eventListeners: EventListeners;
    commands: Commands;
    protected commandResolverKeys: {
        "role_manager.revoke_role": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse>;
        "role_manager.register_message": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse>;
        "role_manager.unregister_message": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse>;
    };
    constructor(roleManagerService: RoleManagerService, permissionManagerService: PermissionManagerService);
    private onReady;
    private revokeRole;
    private registerMessage;
    private unregisterMessage;
}
//# sourceMappingURL=roleManager.d.ts.map