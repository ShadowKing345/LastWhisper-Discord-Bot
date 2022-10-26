import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
/**
 * Module to manager the permissions of commands from a Discord client.
 * @see PermissionManagerService
 */
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
        [key: string]: Function;
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