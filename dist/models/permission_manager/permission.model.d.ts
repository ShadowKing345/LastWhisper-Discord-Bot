import { Guild } from "discord.js";
export declare class Permission {
    roles: string[];
    mode: PermissionMode;
    blackList?: boolean;
    get modeEnum(): string;
    fetchRoleNames(guild: Guild): Promise<string>[];
}
export declare enum PermissionMode {
    ANY = 0,
    STRICT = 1
}
//# sourceMappingURL=permission.model.d.ts.map