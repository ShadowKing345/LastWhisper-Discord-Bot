import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./repository.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { repository } from "../utils/decorators/index.js";
let ManagerUtilsRepository = class ManagerUtilsRepository extends Repository {
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