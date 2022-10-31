import { flattenObject } from "../index.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
export function addPermissionKeys() {
    return function (target, propertyKey) {
        for (const value of Object.values(flattenObject(target[propertyKey]))) {
            PermissionManagerService.addPermissionKey(value);
        }
    };
}
//# sourceMappingURL=addPermissionKeys.js.map