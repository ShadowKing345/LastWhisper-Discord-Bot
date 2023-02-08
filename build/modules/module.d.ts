import { PermissionManagerService } from "../services/permissionManager.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Logger } from "../config/index.js";
export declare abstract class Module {
    protected logger: Logger;
    permissionManagerService: PermissionManagerService;
    readonly moduleName: string;
    protected readonly commandResolverKeys: {
        [name: string]: (interaction: ChatInputCommandInteraction, ...args: unknown[]) => Promise<InteractionResponse | void>;
    };
    protected constructor(logger: Logger, permissionManagerService: PermissionManagerService);
    protected commandResolver(interaction: ChatInputCommandInteraction, call?: boolean): Promise<void | InteractionResponse<boolean> | ((interaction: ChatInputCommandInteraction<import("discord.js").CacheType>, ...args: unknown[]) => Promise<void | InteractionResponse<boolean>>)>;
}
//# sourceMappingURL=module.d.ts.map