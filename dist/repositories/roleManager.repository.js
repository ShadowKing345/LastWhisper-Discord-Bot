import { __decorate, __metadata } from "tslib";
import { singleton } from "tsyringe";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { RoleManagerConfig } from "../models/role_manager/roleManager.model.js";
let RoleManagerRepository = class RoleManagerRepository extends RepositoryBase {
    collectionName = "role_manager";
    mappingObject = RoleManagerConfig;
    constructor(db) {
        super(db);
    }
};
RoleManagerRepository = __decorate([
    singleton(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], RoleManagerRepository);
export { RoleManagerRepository };
//# sourceMappingURL=roleManager.repository.js.map