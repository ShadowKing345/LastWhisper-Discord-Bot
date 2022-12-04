import { Guild } from "discord.js";
import { BaseEntity, Relation } from "typeorm";
import { PermissionManagerConfig } from "./permissionManagerConfig.js";
export declare enum PermissionMode {
    ANY = 0,
    STRICT = 1
}
export declare class Permission extends BaseEntity {
    id: string;
    key: string;
    roles: string[];
    mode: PermissionMode;
    blackList?: boolean;
    guildConfig: Relation<PermissionManagerConfig>;
    get modeEnum(): string;
    fetchRoleNames(guild: Guild): Promise<string>[];
    formatRoles(guild: Guild): Promise<string>;
    merge(obj: Partial<Permission>): Permission;
}
//# sourceMappingURL=permission.d.ts.map