import { InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { Module } from "../utils/objects/index.js";
import { RoleManagerService } from "../services/roleManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Commands } from "../utils/objects/command.js";
import { EventListeners } from "../utils/objects/eventListener.js";
export declare class RoleManagerModule extends Module {
    private roleManagerService;
    moduleName: string;
    eventListeners: EventListeners;
    commands: Commands;
    protected commandResolverKeys: {
        "role_manager.revoke_role": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse>;
        "role_manager.register_message": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse>;
        "role_manager.unregister_message": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse>;
    };
    constructor(roleManagerService: RoleManagerService, logger: pino.Logger, permissionManagerService: PermissionManagerService);
    private onReady;
    private revokeRole;
    private registerMessage;
    private unregisterMessage;
}
//# sourceMappingURL=roleManager.d.ts.map