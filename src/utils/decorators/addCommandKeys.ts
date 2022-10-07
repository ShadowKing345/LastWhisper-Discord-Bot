import { PermissionKeys } from "../../services/permissionManager.service.js";

/**
 * Decorator that adds a list of keys to a permission keys list.
 */
export function addCommandKeys() {
    return function (target: any, key: string | symbol) {
        const value = target[key];
        PermissionKeys.push(value);
        return Object(value);
    };
}
