export class CommandResolverError extends Error {
    constructor(message) {
        super(message);
        this.name = "CommandResolverError";

        Object.setPrototypeOf(this, CommandResolverError.prototype);
    }
}