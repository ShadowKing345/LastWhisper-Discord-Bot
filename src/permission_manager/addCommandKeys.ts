import { PermissionKeysType } from "./models/index.js";

export const PermissionKeys: PermissionKeysType[] = [];

export function addCommandKeys() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: Object, key: string | symbol) {
        const val = target[key];

        if (!("$index" in val)) {
            throw new Error("Cannot find $index");
        }
        PermissionKeys.push(val);
        return val;
    };
}
