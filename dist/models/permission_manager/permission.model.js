export class Permission {
    roles = [];
    mode = PermissionMode.ANY;
    blackList = false;
}
export var PermissionMode;
(function (PermissionMode) {
    PermissionMode[PermissionMode["ANY"] = 0] = "ANY";
    PermissionMode[PermissionMode["STRICT"] = 1] = "STRICT";
})(PermissionMode || (PermissionMode = {}));
//# sourceMappingURL=permission.model.js.map