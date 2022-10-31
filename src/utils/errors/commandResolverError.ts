export class CommandResolverError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommandResolverError";

        Object.setPrototypeOf(this, CommandResolverError.prototype);
    }
}