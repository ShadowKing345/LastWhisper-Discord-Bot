export class InvalidArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidArgumentError";

        Object.setPrototypeOf(this, InvalidArgumentError.prototype);
    }
}