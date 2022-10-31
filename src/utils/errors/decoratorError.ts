

/**
 * Error thrown by a decorator.
 */
export class DecoratorError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DecoratorError";

        Object.setPrototypeOf(this, DecoratorError.prototype);
    }
}