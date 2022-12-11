import { ChatInputCommandInteraction } from "discord.js";
import { Permission } from "../entities/permissionManager/index.js";
import { PermissionManagerRepository } from "../repositories/permissionManager.js";
import { Service } from "./service.js";
export declare class PermissionManagerService extends Service {
    private repository;
    private readonly logger;
    private static readonly keys;
    private static _keysFormatted;
    constructor(repository: PermissionManagerRepository);
    private getConfig;
    getPermission(guildId: string | null, key: string): Promise<Permission | null>;
    setPermission(guildId: string | null, key: string, permission: Permission): Promise<Permission | null>;
    isAuthorized(interaction: ChatInputCommandInteraction, key: string): Promise<boolean>;
    static addPermissionKey(key: string): void;
    static removePermissionKey(key: string): void;
    static keyExists(key: string): boolean;
    static get keysFormatted(): string;
    private static validateKey;
}
//# sourceMappingURL=permissionManager.d.ts.map