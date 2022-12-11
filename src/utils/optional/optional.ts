import { IOptional } from "./iOptional.js";
import { NullValueError } from "../errors/index.js";

export class Optional<T> implements IOptional<T> {
  private readonly value: T;

  constructor(value: T = null) {
    this.value = value;
  }

  public getValue(): T {
    if (!this.hasValue()) {
      throw new NullValueError("Attempted to get a null value from an IOptional object. Try using hasValue method before attempting this call.");
    }

    return this.value;
  }

  public hasValue(): boolean {
    return this.value !== null;
  }

  public map<G>(mapper: (T) => G): IOptional<G> {
    if (!this.hasValue()) {
      return new Optional<G>(null);
    }

    const newValue = mapper(this.value);

    if (!newValue) {
      throw new NullValueError("Mapped value was null.");
    }

    return new Optional(newValue);
  }
}