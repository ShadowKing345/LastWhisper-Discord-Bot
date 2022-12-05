import { __decorate, __metadata } from "tslib";
import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../repository.js";
import { EventObject } from "../../entities/eventManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
let EventObjectRepository = class EventObjectRepository extends Repository {
    constructor(db) {
        super(db, EventObject);
    }
};
EventObjectRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], EventObjectRepository);
export { EventObjectRepository };
//# sourceMappingURL=eventObjectRepository.js.map