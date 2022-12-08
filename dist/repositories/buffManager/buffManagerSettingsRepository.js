import { __decorate, __metadata } from "tslib";
import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../repository.js";
import { BuffManagerSettings } from "../../entities/buffManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
import { IsNull, Not } from "typeorm";
let BuffManagerSettingsRepository = class BuffManagerSettingsRepository extends Repository {
    constructor(db) {
        super(db, BuffManagerSettings);
    }
    getActiveSettings() {
        return this.repo.findBy({
            channelId: Not(IsNull()),
            hour: Not(IsNull()),
            dow: Not(IsNull()),
        });
    }
};
BuffManagerSettingsRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], BuffManagerSettingsRepository);
export { BuffManagerSettingsRepository };
//# sourceMappingURL=buffManagerSettingsRepository.js.map