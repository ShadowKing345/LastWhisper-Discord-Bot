import { __decorate, __metadata } from "tslib";
import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../repository.js";
import { EventReminder } from "../../entities/eventManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
let EventReminderRepository = class EventReminderRepository extends Repository {
    constructor(db) {
        super(db, EventReminder);
    }
};
EventReminderRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], EventReminderRepository);
export { EventReminderRepository };
//# sourceMappingURL=eventReminderRepository.js.map