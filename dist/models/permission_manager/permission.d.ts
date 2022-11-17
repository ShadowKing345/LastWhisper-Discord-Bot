import { Guild } from "discord.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export declare class Permission extends ToJsonBase<Permission> {
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