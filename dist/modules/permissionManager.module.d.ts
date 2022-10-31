import { Role, ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
export declare class PermissionManagerModule extends ModuleBase {
    static permissionKeys: {
        list: string;
        addRole: string;
        removeRole: string;
        config: string;
        reset: string;
    };
    moduleName: string;
    commands: Commands;
    protected commandResolverKeys: {
        "permissions.list": (interaction: ChatInputCommandInteraction, key?: string) => Promise<InteractionResponse>;
        "permissions.add_role": (interaction: ChatInputCommandInteraction, key: string, role: Role) => Promise<InteractionResponse>;
        "permissions.remove_role": (interaction: ChatInputCommandInteraction, key: string, role: Role) => Promise<InteractionResponse>;
        "permissions.set_config": (interaction: ChatInputCommandInteraction, key: string) => Promise<InteractionResponse>;
        "permissions.reset": (interaction: ChatInputCommandInteraction, key: string) => Promise<InteractionResponse>;
    };
    constructor(permissionManagerService: PermissionManagerService, logger: pino.Logger);
    protected commandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    private listPermissions;
    private addRoles;
    private removeRoles;
    private config;
    private reset;
    private static commandKeyHelperBuilder;
}
//# sourceMappingURL=permissionManager.module.d.ts.map