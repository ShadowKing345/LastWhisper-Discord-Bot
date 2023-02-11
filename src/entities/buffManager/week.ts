import { Days } from "./days.js";
import { deepMerge } from "../../utils/index.js";
import { DateTime } from "luxon";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { EntityBase } from "../entityBase.js";
import { Buff } from "./buff.js";

/**
 * Information about a week.
 */
@Entity()
export class Week extends EntityBase {
  @Column({ type: "boolean" })
  public isEnabled = false;

  @Column()
  public title: string = null;

  @OneToOne(() => Days, { cascade: true, orphanedRowAction: "delete", eager: true })
  @JoinColumn({ name: "days_id" })
  public days: Days;

  /**
   * Returns the buff ID for a given day of the week,
   * @param date The date object to get the string from.
   */
  public getBuff(date: DateTime): Promise<Buff> {
    return Array(...this.days)[date.weekday - 1];
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
