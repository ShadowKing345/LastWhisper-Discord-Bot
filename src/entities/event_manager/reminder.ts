import { Duration, DateTime } from "luxon";
import { BaseEntity, Relation, PrimaryGeneratedColumn, Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";

/**
 * Reminder trigger. Used to calculate how long until an event reminder needs to be sent.
 */
@Entity()
export class Reminder extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public message: string = null;

  @Column()
  public timeDelta: string = null;

  @ManyToOne(() => EventManagerConfig, config => config.reminders)
  @JoinColumn({ name: "config_id" })
  public guildConfig: Relation<EventManagerConfig>;

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
