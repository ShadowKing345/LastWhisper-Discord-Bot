import { IEntity } from "../../utils/objects/repository.js";
import { Permission } from "./permission.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export declare class PermissionManagerConfig extends ToJsonBase<PermissionManagerConfig> implements IEntity<string> {
    _id: string;
    guildId: string;
    permissions: {
        [key: string]: Permission;
    };
    merge(obj: Partial<PermissionManagerConfig>): PermissionManagerConfig;
}
//# sourceMappingURL=permissionManagerConfig.d.ts.map