export function subcommandResolved(...keys) {
    const key = keys.join(".");
    return function (target, propertyKey, descriptor) {
        target.subcommandKeys ??= {};
        target.subcommandKeys[key] = target[propertyKey];
        return descriptor;
    };
}
//# sourceMappingURL=assignFunction.js.js.map