import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { deepMerge } from "../../utils/index.js";
/**
 * Permission manager configuration object.
 */
export class PermissionManagerConfig extends ToJsonBase {
    _id;
    guildId;
    permissions = {};
    merge(obj) {
        if (obj._id) {
            this._id = obj._id;
        }
        if (obj.guildId) {
            this.guildId = obj.guildId;
        }
        if (obj.permissions) {
            this.permissions = deepMerge(this.permissions ?? {}, obj.permissions);
        }
        return this;
    }
}
//# sourceMappingURL=permissionManagerConfig.model.js.map