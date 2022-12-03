import { Buff } from "./buff.js";
import { MessageSettings } from "./messageSettings.js";
import { Week } from "./week.js";
import { IEntity } from "../../utils/objects/repository.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { deepMerge } from "../../utils/index.js";
import { DateTime } from "luxon";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity, OneToOne, JoinColumn } from "typeorm";

/**
 * Buff Manager Configuration Object.
 */
@Entity()
export class BuffManagerConfig extends ToJsonBase<BuffManagerConfig> implements IEntity<string> {
  public _id: string;

  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public guildId: string = null;

  @OneToOne(() => MessageSettings, settings => settings.guildConfig, {cascade: true, orphanedRowAction:"delete"})
  @JoinColumn({name:"message_settings_id"})
  public messageSettings: MessageSettings = new MessageSettings();

  @OneToMany(() => Buff, buff => buff.guildConfig, {cascade: true, orphanedRowAction:"delete"})
  public buffs: Buff[];

  @OneToMany(() => Week, week => week.guildConfig, {cascade: true, orphanedRowAction: "delete"})
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

  public merge(obj: BuffManagerConfig): BuffManagerConfig {
    if (obj._id) {
      this._id = obj._id;
    }

    if (obj.guildId) {
      this.guildId = obj.guildId;
    }

    if (obj.messageSettings) {
      this.messageSettings = deepMerge(this.messageSettings ?? new MessageSettings(), this.messageSettings);
    }

    if (obj.buffs) {
      this.buffs = obj.buffs;
      this.buffs = (this.buffs ?? []).map(buff => deepMerge(new Buff(), buff));
    }

    if (obj.weeks) {
      this.weeks = obj.weeks;
      this.weeks = (this.weeks ?? []).map(week => deepMerge(new Week(), week));
    }

    return this;
  }
}
