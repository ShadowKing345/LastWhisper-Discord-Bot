import { CommandInteraction, Interaction, Role } from "discord.js";
import { pino } from "pino";
import { PermissionKeysType } from "../models/permission_manager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.repository.js";
export declare class PermissionManagerService {
    private permissionManagerRepository;
    private logger;
    constructor(permissionManagerRepository: PermissionManagerRepository, logger: pino.Logger);
    isAuthorized(interaction: Interaction, key: string): Promise<boolean>;
    addRole(interaction: CommandInteraction, key: string, role: Role): Promise<void>;
    removeRole(interaction: CommandInteraction, key: string, role: Role): Promise<void>;
    config(interaction: CommandInteraction, key: string): Promise<void>;
    reset(interaction: CommandInteraction, key: string): Promise<void>;
    listPermissions(interaction: CommandInteraction, key?: string): Promise<void>;
    private findOneOrCreate;
    static addPermissionKeys(keys: PermissionKeysType): void;
    static removePermissionKey(prefix: string): void;
    private static keyExists;
}
//# sourceMappingURL=permissionManager.service.d.ts.map