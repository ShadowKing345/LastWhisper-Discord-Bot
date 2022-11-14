export class Permission {
    roles = [];
    mode = PermissionMode.ANY;
    blackList = false;
    get modeEnum() {
        return PermissionMode[this.mode];
    }
    fetchRoleNames(guild) {
        return this.roles.map((roleId) => guild?.roles.fetch(roleId).then((role) => role?.name));
    }
}
export var PermissionMode;
(function (PermissionMode) {
    PermissionMode[PermissionMode["ANY"] = 0] = "ANY";
    PermissionMode[PermissionMode["STRICT"] = 1] = "STRICT";
})(PermissionMode || (PermissionMode = {}));
//# sourceMappingURL=permission.model.js.map