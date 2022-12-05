import { Repository } from "../repository.js";
import { Week } from "../../entities/buffManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
import { DateTime } from "luxon";
export declare class WeekRepository extends Repository<Week> {
    constructor(db: DatabaseService);
    getActiveWeeks(guildId: string): Promise<Week[]>;
    getWeekOfYear(guildId: string, date: DateTime): Promise<Week>;
}
//# sourceMappingURL=weekRepository.d.ts.map