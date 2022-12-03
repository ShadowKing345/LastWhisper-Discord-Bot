import { Guild } from "discord.js";
import { BaseEntity } from "typeorm";
export declare class Permission extends BaseEntity {
    roles: string[];
    mode: PermissionMode;
    blackList?: boolean;
    get modeEnum(): string;
    fetchRoleNames(guild: Guild): Promise<string>[];
    formatRoles(guild: Guild): Promise<string>;
    merge(obj: Partial<Permission>): Permission;
}
export declare enum PermissionMode {
    ANY = 0,
    STRICT = 1
}
//# sourceMappingURL=permission.d.ts.map