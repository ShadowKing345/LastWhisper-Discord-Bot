import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../../config/index.js";
import { EventManagerSettings } from "../../entities/eventManager/index.js";
import { repository } from "../../decorators/index.js";
import { SelfCreatingRepository } from "../base/selfCreatingRepository.js";
let EventManagerSettingsRepository = class EventManagerSettingsRepository extends SelfCreatingRepository {
    constructor(db) {
        super(db, EventManagerSettings);
    }
};
EventManagerSettingsRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], EventManagerSettingsRepository);
export { EventManagerSettingsRepository };
//# sourceMappingURL=eventManagerSettingsRepository.js.map