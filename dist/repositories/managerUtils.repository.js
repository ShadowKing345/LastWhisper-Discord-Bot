import { __decorate, __metadata } from "tslib";
import { singleton } from "tsyringe";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { ManagerUtilsConfig } from "../models/manager_utils/managerUtils.model.js";
let ManagerUtilsRepository = class ManagerUtilsRepository extends RepositoryBase {
    collectionName = "manager_utils";
    mappingObject = ManagerUtilsConfig;
    constructor(db) {
        super(db);
    }
};
ManagerUtilsRepository = __decorate([
    singleton(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], ManagerUtilsRepository);
export { ManagerUtilsRepository };
//# sourceMappingURL=managerUtils.repository.js.map