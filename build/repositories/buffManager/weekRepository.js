import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../../config/index.js";
import { Week } from "../../entities/buffManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";
let WeekRepository = class WeekRepository extends Repository {
    constructor(db) {
        super(db, Week);
    }
    getActiveWeeks(guildId) {
        return this.findAll({
            where: {
                guildId: guildId,
                isEnabled: true,
            },
        });
    }
    async getWeekOfYear(guildId, date) {
        const filteredWeeks = await this.getActiveWeeks(guildId);
        if (filteredWeeks.length < 1) {
            return null;
        }
        return filteredWeeks[date.weekNumber % filteredWeeks.length];
    }
};
WeekRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], WeekRepository);
export { WeekRepository };
//# sourceMappingURL=weekRepository.js.map