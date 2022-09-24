import { BasicModel } from "../../utils/models/index.js";
import { Permission } from "./permission.model.js";
export declare class PermissionManagerConfig extends BasicModel {
    guildId: string;
    permissions: {
        [key: string]: Permission;
    };
}
//# sourceMappingURL=permissionManagerConfig.model.d.ts.map