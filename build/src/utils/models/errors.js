/**
 * Error thrown when an argument is not of the correct value or type.
 */
export class InvalidArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidArgumentError";
        Object.setPrototypeOf(this, InvalidArgumentError.prototype);
    }
}
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
//# sourceMappingURL=errors.js.map