import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export class Permission extends ToJsonBase {
    roles = [];
    mode = PermissionMode.ANY;
    blackList = false;
    get modeEnum() {
        return PermissionMode[this.mode];
    }
    fetchRoleNames(guild) {
        return this.roles.map(roleId => guild?.roles.fetch(roleId).then(role => role?.name));
    }
    async formatRoles(guild) {
        return this.roles.length > 0
            ? (await Promise.allSettled(this.fetchRoleNames(guild))).join("\n")
            : "No roles were set.";
    }
    merge(obj) {
        if (obj.blackList) {
            this.blackList = obj.blackList;
        }
        if (obj.mode) {
            this.mode = obj.mode;
        }
        if (obj.roles) {
            this.roles = obj.roles;
        }
        return this;
    }
}
export var PermissionMode;
(function (PermissionMode) {
    PermissionMode[PermissionMode["ANY"] = 0] = "ANY";
    PermissionMode[PermissionMode["STRICT"] = 1] = "STRICT";
})(PermissionMode || (PermissionMode = {}));
//# sourceMappingURL=permission.js.map