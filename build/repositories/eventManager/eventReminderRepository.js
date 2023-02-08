import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../../config/index.js";
import { EventReminder } from "../../entities/eventManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";
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