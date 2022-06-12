export const PermissionKeys = [];
export function addCommandKeys() {
    return function (target, key) {
        const value = target[key];
        PermissionKeys.push(value);
        return Object(value);
    };
}
//# sourceMappingURL=addCommandKeys.decorator.js.map