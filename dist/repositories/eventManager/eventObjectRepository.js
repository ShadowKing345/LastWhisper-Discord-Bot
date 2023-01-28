import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../../config/index.js";
import { EventObject } from "../../entities/eventManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";
let EventObjectRepository = class EventObjectRepository extends Repository {
    constructor(db) {
        super(db, EventObject);
    }
    async getEventsByGuildId(guildId) {
        return this.repo.find({ where: { guildId } });
    }
};
EventObjectRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], EventObjectRepository);
export { EventObjectRepository };
//# sourceMappingURL=eventObjectRepository.js.map