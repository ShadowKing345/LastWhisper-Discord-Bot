/**
 * Error to be thrown when a database or repository error occurs.
 */
export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";

        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}