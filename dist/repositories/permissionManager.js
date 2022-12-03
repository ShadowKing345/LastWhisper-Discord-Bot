import { __decorate, __metadata } from "tslib";
import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { PermissionManagerConfig } from "../entities/permission_manager/index.js";
import { repository } from "../utils/decorators/index.js";
let PermissionManagerRepository = class PermissionManagerRepository extends Repository {
    constructor(db) {
        super(db, PermissionManagerConfig);
    }
};
PermissionManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], PermissionManagerRepository);
export { PermissionManagerRepository };
//# sourceMappingURL=permissionManager.js.map