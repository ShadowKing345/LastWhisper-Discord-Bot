import { DateTime } from "luxon";
import { DatabaseService } from "../../config/index.js";
import { Week } from "../../entities/buffManager/index.js";
import { Repository } from "../base/repository.js";
export declare class WeekRepository extends Repository<Week> {
    constructor(db: DatabaseService);
    getActiveWeeks(guildId: string): Promise<Week[]>;
    getWeekOfYear(guildId: string, date: DateTime): Promise<Week | null>;
}
//# sourceMappingURL=weekRepository.d.ts.map