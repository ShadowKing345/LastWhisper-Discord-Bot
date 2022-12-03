import { __decorate, __metadata } from "tslib";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { EventManagerConfig } from "../entities/event_manager/index.js";
import { repository } from "../utils/decorators/index.js";
let EventManagerRepository = class EventManagerRepository extends Repository {
    db;
    constructor(db) {
        super(db, EventManagerConfig);
        this.db = db;
    }
};
EventManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], EventManagerRepository);
export { EventManagerRepository };
//# sourceMappingURL=eventManager.js.map