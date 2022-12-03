import { deepMerge } from "../../utils/index.js";
import { BaseEntity } from "typeorm";
export class PermissionManagerConfig extends BaseEntity {
    id;
    guildId = null;
    permissions = {};
    merge(obj) {
        if (obj.id) {
            this.id = obj.id;
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
//# sourceMappingURL=permissionManagerConfig.js.map