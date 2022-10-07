import { PermissionKeys } from "../../services/permissionManager.service.js";
import { PermissionKeysType } from "../../models/permission_manager/index.js";

/**
 * Decorator that adds a list of keys to a permission keys list.
 */
export function addCommandKeys() {
    return function (target: PermissionKeysType, key: string | symbol) {
        const value = target[key];
        PermissionKeys.push(value);
        return Object(value);
    };
}
