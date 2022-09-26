import { IEntity } from "../../utils/objects/repositoryBase.js";
import { Permission } from "./permission.model.js";
/**
 * Permission manager configuration object.
 */
export declare class PermissionManagerConfig implements IEntity {
    _id: any;
    guildId: string;
    permissions: {
        [key: string]: Permission;
    };
}
//# sourceMappingURL=permissionManagerConfig.model.d.ts.map