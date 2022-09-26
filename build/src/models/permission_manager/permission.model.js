/**
 * Representation of a permission.
 */
export class Permission {
    roles = [];
    mode = PermissionMode.ANY;
    blackList = false;
}
// Modes for how permissions are handled.
export var PermissionMode;
(function (PermissionMode) {
    PermissionMode[PermissionMode["ANY"] = 0] = "ANY";
    PermissionMode[PermissionMode["STRICT"] = 1] = "STRICT";
})(PermissionMode || (PermissionMode = {}));
//# sourceMappingURL=permission.model.js.map