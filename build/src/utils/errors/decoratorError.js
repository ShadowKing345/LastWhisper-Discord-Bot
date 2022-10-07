/**
 * Error thrown by a decorator.
 */
export class DecoratorError extends Error {
    constructor(message) {
        super(message);
        this.name = "DecoratorError";
        Object.setPrototypeOf(this, DecoratorError.prototype);
    }
}
//# sourceMappingURL=decoratorError.js.map