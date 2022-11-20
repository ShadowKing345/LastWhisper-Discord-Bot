import { __decorate, __metadata } from "tslib";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { EventManagerConfig } from "../models/event_manager/index.js";
import { repository } from "../utils/decorators/index.js";
let EventManagerRepository = class EventManagerRepository extends Repository {
    collectionName = "event_manager";
    mappingObject = EventManagerConfig;
    constructor(db) {
        super(db);
    }
};
EventManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], EventManagerRepository);
export { EventManagerRepository };
//# sourceMappingURL=eventManager.js.map