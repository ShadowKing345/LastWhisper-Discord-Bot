import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../../config/databaseService.js";
import { Repository } from "../repository.js";
import { EventManagerSettings } from "../../entities/eventManager/index.js";
import { repository } from "../../utils/decorators/index.js";
let EventManagerSettingsRepository = class EventManagerSettingsRepository extends Repository {
    constructor(db) {
        super(db, EventManagerSettings);
    }
    getConfig(guildId) {
        return this.findOne({ where: { guildId } });
    }
};
EventManagerSettingsRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], EventManagerSettingsRepository);
export { EventManagerSettingsRepository };
//# sourceMappingURL=eventManagerSettingsRepository.js.map