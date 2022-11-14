import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
export declare class PermissionManagerModule extends ModuleBase {
    service: PermissionManagerService;
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
        "permissions.list": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    constructor(service: PermissionManagerService, logger: pino.Logger);
    protected commandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    listPermissions(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    private static commandKeyHelperBuilder;
}
//# sourceMappingURL=permissionManager.module.d.ts.map