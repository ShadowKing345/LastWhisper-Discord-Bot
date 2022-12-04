import { __decorate, __metadata } from "tslib";
import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../repository.js";
import { Days } from "../../entities/buffManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
let DaysRepository = class DaysRepository extends Repository {
    constructor(db) {
        super(db, Days);
    }
};
DaysRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], DaysRepository);
export { DaysRepository };
//# sourceMappingURL=daysRepository.js.map