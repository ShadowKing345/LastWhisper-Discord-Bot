import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../repository.js";
import { Week } from "../../entities/buffManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
import { DateTime } from "luxon";

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

  public async getWeekOfYear(guildId: string, date: DateTime): Promise<Week> {
    const filteredWeeks = await this.getActiveWeeks(guildId);
    return filteredWeeks[date.weekNumber % filteredWeeks.length];
  }
}