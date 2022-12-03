import { Buff } from "./buff.js";
import { MessageSettings } from "./messageSettings.js";
import { Week } from "./week.js";
import { DateTime } from "luxon";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne, BaseEntity, AfterLoad, AfterInsert, AfterUpdate } from "typeorm";

/**
 * Buff Manager Configuration Object.
 */
@Entity()
export class BuffManagerConfig extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public guildId: string = null;

  @OneToOne(() => MessageSettings, settings => settings.guildConfig, {
    cascade: true,
    orphanedRowAction: "delete",
    onDelete: "CASCADE",
  })
  public messageSettings: MessageSettings = new MessageSettings();

  @OneToMany(() => Buff, buff => buff.guildConfig, { cascade: true, orphanedRowAction: "delete", onDelete: "CASCADE" })
  public buffs: Buff[];

  @OneToMany(() => Week, week => week.guildConfig, { cascade: true, orphanedRowAction: "delete", onDelete: "CASCADE" })
  public weeks: Week[];

  /**
   * Returns the week object for a given date of the year.
   * The object is based on the week number.
   * @param date
   */
  public getWeekOfYear(date: DateTime): Week {
    const filteredWeeks = this.getFilteredWeeks;
    return filteredWeeks[date.weekNumber % filteredWeeks.length];
  }

  /**
   * Returns a collection of filtered weeks based if they are enabled.
   */
  public get getFilteredWeeks(): Week[] {
    return this.weeks?.filter(week => week.isEnabled) ?? [];
  }

  /**
   * Returns the buff with the given ID.
   * @param buffId The ID of the buff to be returned.
   */
  public getBuff(buffId: string): Buff | null {
    return this.buffs?.find(buff => buff.id === buffId);
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  public nullChecks(): void {
    if (!this.buffs) {
      this.buffs = [];
    }

    if (!this.weeks) {
      this.weeks = [];
    }
  }
}
