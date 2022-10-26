import { IEntity } from "../../utils/objects/repositoryBase.js";
import { Permission } from "./permission.model.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
/**
 * Permission manager configuration object.
 */
export declare class PermissionManagerConfig extends ToJsonBase<PermissionManagerConfig> implements IEntity {
    _id: any;
    guildId: string;
    permissions: {
        [key: string]: Permission;
    };
    merge(obj: Partial<PermissionManagerConfig>): PermissionManagerConfig;
}
//# sourceMappingURL=permissionManagerConfig.model.d.ts.map