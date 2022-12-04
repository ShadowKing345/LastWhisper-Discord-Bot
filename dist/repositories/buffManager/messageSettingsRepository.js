import { __decorate, __metadata } from "tslib";
import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../repository.js";
import { MessageSettings } from "../../entities/buffManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
let MessageSettingsRepository = class MessageSettingsRepository extends Repository {
    constructor(db) {
        super(db, MessageSettings);
    }
};
MessageSettingsRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], MessageSettingsRepository);
export { MessageSettingsRepository };
//# sourceMappingURL=messageSettingsRepository.js.map