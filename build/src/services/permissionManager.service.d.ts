import { CommandInteraction, Interaction, Role, InteractionResponse, ChatInputCommandInteraction } from "discord.js";
import { pino } from "pino";
import { PermissionKeysType } from "../models/permission_manager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";
export declare const PermissionKeys: any;
export declare class PermissionManagerService {
    private permissionManagerRepository;
    private logger;
    constructor(permissionManagerRepository: PermissionManagerRepository, logger: pino.Logger);
    isAuthorized(interaction: Interaction, key: string): Promise<boolean>;
    addRole(interaction: CommandInteraction, key: string, role: Role): Promise<InteractionResponse>;
    removeRole(interaction: CommandInteraction, key: string, role: Role): Promise<InteractionResponse>;
    config(interaction: ChatInputCommandInteraction, key: string): Promise<InteractionResponse>;
    reset(interaction: CommandInteraction, key: string): Promise<InteractionResponse>;
    listPermissions(interaction: CommandInteraction, key?: string): Promise<InteractionResponse>;
    private findOneOrCreate;
    static addPermissionKeys(keys: PermissionKeysType): void;
    static removePermissionKey(prefix: string): void;
    private static keyExists;
}
//# sourceMappingURL=permissionManager.service.d.ts.map