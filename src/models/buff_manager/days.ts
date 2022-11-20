/**
 * Representation of one week's worth of buffs.
 */
export class Days {
  public monday: string = null;
  public tuesday: string = null;
  public wednesday: string = null;
  public thursday: string = null;
  public friday: string = null;
  public saturday: string = null;
  public sunday: string = null;

  private current = 0;

  private get array() {
    return [this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday];
  }

  [Symbol.iterator]() {
    this.current = 0;
    return this;
  }

  next() {
    if (this.current < 7) {
      return { done: false, value: this.array[this.current++] };
    }

    return { done: true, value: null };
  }
}
