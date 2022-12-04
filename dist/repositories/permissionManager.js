import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./repository.js";
import { PermissionManagerConfig } from "../entities/permissionManager/index.js";
import { repository } from "../utils/decorators/index.js";
let PermissionManagerRepository = class PermissionManagerRepository extends Repository {
    constructor(db) {
        super(db, PermissionManagerConfig);
    }
};
PermissionManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], PermissionManagerRepository);
export { PermissionManagerRepository };
//# sourceMappingURL=permissionManager.js.map