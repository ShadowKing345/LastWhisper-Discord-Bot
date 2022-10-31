export class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}
//# sourceMappingURL=DatabaseError.js.map