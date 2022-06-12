export const PermissionManagerKeys = [];
export function addCommandKeys() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target, key) {
        const val = target[key];
        if (!("$index" in val)) {
            throw new Error("Cannot find $index");
        }
        PermissionManagerKeys.push(val);
        return val;
    };
}
//# sourceMappingURL=addCommandKeys.js.map