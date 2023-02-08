import { __decorate, __metadata } from "tslib";
import { IsNull, Not } from "typeorm";
import { DatabaseService } from "../../config/index.js";
import { BuffManagerSettings } from "../../entities/buffManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";
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