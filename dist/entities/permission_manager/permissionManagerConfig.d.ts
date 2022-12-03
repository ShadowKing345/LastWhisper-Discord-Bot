import { Permission } from "./permission.js";
import { BaseEntity } from "typeorm";
export declare class PermissionManagerConfig extends BaseEntity {
    id: string;
    guildId: string;
    permissions: {
        [key: string]: Permission;
    };
    merge(obj: Partial<PermissionManagerConfig>): PermissionManagerConfig;
}
//# sourceMappingURL=permissionManagerConfig.d.ts.map