import { __decorate, __metadata } from "tslib";
import { singleton } from "tsyringe";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { PermissionManagerConfig } from "../models/permission_manager/index.js";
let PermissionManagerRepository = class PermissionManagerRepository extends RepositoryBase {
    collectionName = "permission_manager";
    mappingObject = PermissionManagerConfig;
    constructor(db) {
        super(db);
    }
};
PermissionManagerRepository = __decorate([
    singleton(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], PermissionManagerRepository);
export { PermissionManagerRepository };
//# sourceMappingURL=permissionManager.repository.js.map