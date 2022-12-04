import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./repository.js";
import { EventManagerConfig } from "../entities/eventManager/index.js";
import { repository } from "../utils/decorators/index.js";
let EventManagerRepository = class EventManagerRepository extends Repository {
    constructor(db) {
        super(db, EventManagerConfig);
    }
};
EventManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], EventManagerRepository);
export { EventManagerRepository };
//# sourceMappingURL=eventManager.js.map