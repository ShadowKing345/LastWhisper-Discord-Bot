import { Duration, DateTime } from "luxon";
import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";

/**
 * Reminder trigger. Used to calculate how long until an event reminder needs to be sent.
 */
@Entity()
export class EventReminder extends EntityBase {

  @Column()
  public message: string = null;

  @Column()
  public timeDelta: string = null;

  constructor() {
    super();
  }

  /**
   * Returns the duration equivalent of the time delta variable.
   */
  public get asDuration(): Duration {
    const hold = DateTime.fromFormat(this.timeDelta, "HH:mm");
    return Duration.fromObject({
      hours: hold.get("hour"),
      minutes: hold.get("minute"),
    });
  }
}
