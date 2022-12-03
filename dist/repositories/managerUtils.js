import { __decorate, __metadata } from "tslib";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { repository } from "../utils/decorators/index.js";
let ManagerUtilsRepository = class ManagerUtilsRepository extends Repository {
    constructor(db) {
        super(db, ManagerUtilsConfig);
    }
};
ManagerUtilsRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], ManagerUtilsRepository);
export { ManagerUtilsRepository };
//# sourceMappingURL=managerUtils.js.map