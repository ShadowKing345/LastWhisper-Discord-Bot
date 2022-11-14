import { __decorate, __metadata } from "tslib";
import { singleton } from "tsyringe";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { EventManagerConfig } from "../models/event_manager/index.js";
let EventManagerRepository = class EventManagerRepository extends RepositoryBase {
    collectionName = "event_manager";
    mappingObject = EventManagerConfig;
    constructor(db) {
        super(db);
    }
};
EventManagerRepository = __decorate([
    singleton(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], EventManagerRepository);
export { EventManagerRepository };
//# sourceMappingURL=eventManager.js.map