export class WrongChannelError extends Error {
  constructor(message: string) {
    super(message);

    this.name = WrongChannelError.name;
    Object.setPrototypeOf(this, WrongChannelError.prototype);
  }
}