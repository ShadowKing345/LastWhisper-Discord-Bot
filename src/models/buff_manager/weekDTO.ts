import { Buff } from "./buff.js";
import { Week } from "./week.js";
import { BuffManagerConfig } from "./buffManagerConfig.js";
import { WeekDays, DaysOfWeek } from "./weekDays.js";

/**
 * Since week objects only save the ID of the buff rather than the buff itself this object is used to provide a week object with all the buffs registered.
 */
export class WeekDTO {
  public isEnabled = false;
  public title: string = null;
  public days: Map<WeekDays, Buff | null> = new Map();

  /**
   * Maps a week object into a WeekDTO one.
   * @param week Week object to be converted.
   * @param config Config file to get the buffs from.
   */
  public static map(week: Week, config: BuffManagerConfig): WeekDTO {
    const result = new WeekDTO();
    result.isEnabled = week.isEnabled;
    result.title = week.title;

    Array(...week.days).forEach((buffId, index) => result.days.set(DaysOfWeek[index], config.getBuff(buffId)));

    return result;
  }
}