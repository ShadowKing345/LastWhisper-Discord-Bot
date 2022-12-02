import { __decorate, __metadata } from "tslib";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { PermissionManagerConfig } from "../entities/permission_manager/index.js";
import { repository } from "../utils/decorators/index.js";
let PermissionManagerRepository = class PermissionManagerRepository extends Repository {
    collectionName = "permission_manager";
    mappingObject = PermissionManagerConfig;
    constructor(db) {
        super(db);
    }
};
PermissionManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], PermissionManagerRepository);
export { PermissionManagerRepository };
//# sourceMappingURL=permissionManager.js.map