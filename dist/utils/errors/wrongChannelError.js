export class WrongChannelError extends Error {
    constructor(message) {
        super(message);
        this.name = WrongChannelError.name;
        Object.setPrototypeOf(this, WrongChannelError.prototype);
    }
}
//# sourceMappingURL=wrongChannelError.js.map