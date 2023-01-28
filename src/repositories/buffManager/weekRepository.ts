import { DateTime } from "luxon";
import { DatabaseService } from "../../config/index.js";
import { Week } from "../../entities/buffManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";

@repository()
export class WeekRepository extends Repository<Week> {
  constructor(db: DatabaseService) {
    super(db, Week);
  }

  public getActiveWeeks(guildId: string): Promise<Week[]> {
    return this.findAll({
      where: {
        guildId: guildId,
        isEnabled: true,
      },
    });
  }

  public async getWeekOfYear(guildId: string, date: DateTime): Promise<Week | null> {
    const filteredWeeks = await this.getActiveWeeks(guildId);

    if (filteredWeeks.length < 1) {
      return null;
    }

    return filteredWeeks[date.weekNumber % filteredWeeks.length];
  }
}