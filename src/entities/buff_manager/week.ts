import { Days } from "./days.js";
import { deepMerge } from "../../utils/index.js";
import { DateTime } from "luxon";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, Relation, BaseEntity } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";

/**
 * Information about a week.
 */
@Entity()
export class Week extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({
    type: "boolean",
  })
  public isEnabled = false;

  @Column()
  public title: string = null;

  @OneToOne(() => Days, { cascade: true, orphanedRowAction: "delete" })
  @JoinColumn({ name: "days_id" })
  public days: Days;

  @ManyToOne(() => BuffManagerConfig, config => config.weeks)
  @JoinColumn({ name: "config_id" })
  public guildConfig: Relation<BuffManagerConfig>;

  /**
   * Returns the buff ID for a given day of the week,
   * @param date The date object to get the string from.
   */
  public getBuffId(date: DateTime): string {
    return Array(...this.days)[date.weekday - 1].id;
  }

  public merge(obj: Week): Week {
    if (obj.isEnabled) {
      this.isEnabled = obj.isEnabled;
    }

    if (obj.title) {
      this.title = obj.title;
    }

    if (obj.days) {
      this.days = deepMerge(this.days ?? new Days(), obj.days);
    }

    return this;
  }
}
