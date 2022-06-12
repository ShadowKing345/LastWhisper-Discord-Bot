export class PermissionManagerConfig {
    _id;
    guildId;
    permissions = {};
}
export var PermissionMode;
(function (PermissionMode) {
    PermissionMode[PermissionMode["ANY"] = 0] = "ANY";
    PermissionMode[PermissionMode["STRICT"] = 1] = "STRICT";
})(PermissionMode || (PermissionMode = {}));
export class Permission {
    roles = [];
    mode = PermissionMode.ANY;
    blackList = false;
}
//# sourceMappingURL=permissionManagerConfig.model.js.map