/**
 * Interface of a class that manages Optional results.
 */
export interface IOptional<T> {
  /**
   * Returns if the object exists or is null.
   */
  hasValue(): boolean;

  /**
   * Returns the value.
   * Throws if the value is null.
   */
  getValue(): T;

  /**
   * Maps the value to a different type returning an IOptional of that type instead.
   * If the value is null a new optional is returned that is null.
   * @param mapper The mapper function.
   */
  map<G>(mapper: (T) => G): IOptional<G>;
}