import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../../config/databaseService.js";
import { Repository } from "../repository.js";
import { EventManagerConfig } from "../../entities/eventManager/index.js";
import { repository } from "../../utils/decorators/index.js";
let EventManagerConfigRepository = class EventManagerConfigRepository extends Repository {
    constructor(db) {
        super(db, EventManagerConfig);
    }
};
EventManagerConfigRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], EventManagerConfigRepository);
export { EventManagerConfigRepository };
//# sourceMappingURL=eventManagerConfigRepository.js.map