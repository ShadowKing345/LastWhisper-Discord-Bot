import { CommandInteraction, Interaction, Role } from "discord.js";
import { PermissionKeys } from "../models/permissionManagerConfig.model.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";
export declare const PermissionManagerKeys: PermissionKeys[];
export declare class PermissionManagerService {
    private permissionManagerRepository;
    private readonly logger;
    constructor(permissionManagerRepository: PermissionManagerRepository);
    isAuthorized(interaction: Interaction, key: string): Promise<boolean>;
    addRole(interaction: CommandInteraction, key: string, role: Role): Promise<void>;
    removeRole(interaction: CommandInteraction, key: string, role: Role): Promise<void>;
    config(interaction: CommandInteraction, key: string): Promise<void>;
    reset(interaction: CommandInteraction, key: string): Promise<void>;
    listPermissions(interaction: CommandInteraction, key?: string): Promise<void>;
    private findOneOrCreate;
    static addPermissionKeys(keys: PermissionKeys): void;
    static removePermissionKey(prefix: string): void;
    private static keyExists;
}
//# sourceMappingURL=permissionManager.service.d.ts.map