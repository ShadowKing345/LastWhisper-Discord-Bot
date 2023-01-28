import { flattenObject } from "../utils/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
export function addPermissionKeys() {
    return function (target, propertyKey) {
        for (const value of Object.values(flattenObject(target[propertyKey]))) {
            PermissionManagerService.addPermissionKey(value);
        }
    };
}
//# sourceMappingURL=addPermissionKeys.js.map