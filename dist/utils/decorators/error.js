export function error() {
    return function (c) {
        Object.setPrototypeOf(c, c.prototype);
    };
}
//# sourceMappingURL=error.js.map