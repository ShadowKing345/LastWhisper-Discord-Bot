import { BasicModel } from "../../shared/models/basicModel.js";
import { Permission } from "./permission.model.js";
export declare class PermissionManagerConfig extends BasicModel {
    guildId: string;
    permissions: {
        [key: string]: Permission;
    };
}
//# sourceMappingURL=permissionManagerConfig.model.d.ts.map