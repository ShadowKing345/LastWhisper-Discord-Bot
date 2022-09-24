import { PermissionKeysType } from "../models/permission_manager/index.js";

export const PermissionKeys: PermissionKeysType[] = [];

export function addCommandKeys() {
    return function (target: any, key: string | symbol) {
        const value = target[key];
        PermissionKeys.push(value);
        return Object(value);
    };
}
