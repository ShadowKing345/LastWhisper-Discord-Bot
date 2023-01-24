import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../config/databaseService.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { repository } from "../utils/decorators/index.js";
import { SelfCreatingRepository } from "./base/selfCreatingRepository.js";
let ManagerUtilsRepository = class ManagerUtilsRepository extends SelfCreatingRepository {
    constructor(db) {
        super(db, ManagerUtilsConfig);
    }
};
ManagerUtilsRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], ManagerUtilsRepository);
export { ManagerUtilsRepository };
//# sourceMappingURL=managerUtils.js.map