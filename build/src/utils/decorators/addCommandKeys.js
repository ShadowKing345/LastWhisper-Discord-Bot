import { PermissionKeys } from "../../services/permissionManager.service.js";
/**
 * Decorator that adds a list of keys to a permission keys list.
 */
export function addCommandKeys() {
    return function (target, key) {
        const value = target[key];
        PermissionKeys.push(value);
        return Object(value);
    };
}
//# sourceMappingURL=addCommandKeys.js.map