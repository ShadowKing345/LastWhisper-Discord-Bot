import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Buff } from "./buff.js";

/**
 * Representation of one week's worth of buffs.
 */
@Entity()
export class Days {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @OneToOne(() => Buff)
  @JoinColumn({ name: "monday_id" })
  public monday: Buff;

  @OneToOne(() => Buff)
  @JoinColumn({ name: "tuesday_id" })
  public tuesday: Buff;

  @OneToOne(() => Buff)
  @JoinColumn({ name: "wednesday_id" })
  public wednesday: Buff;

  @OneToOne(() => Buff)
  @JoinColumn({ name: "thursday_id" })
  public thursday: Buff;

  @OneToOne(() => Buff)
  @JoinColumn({ name: "friday_id" })
  public friday: Buff;

  @OneToOne(() => Buff)
  @JoinColumn({ name: "saturday_id" })
  public saturday: Buff;

  @OneToOne(() => Buff)
  @JoinColumn({ name: "sunday_id" })
  public sunday: Buff;

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
