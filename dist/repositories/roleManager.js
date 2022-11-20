import { __decorate, __metadata } from "tslib";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { RoleManagerConfig } from "../models/roleManager.js";
import { repository } from "../utils/decorators/index.js";
let RoleManagerRepository = class RoleManagerRepository extends Repository {
    collectionName = "role_manager";
    mappingObject = RoleManagerConfig;
    constructor(db) {
        super(db);
    }
};
RoleManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], RoleManagerRepository);
export { RoleManagerRepository };
//# sourceMappingURL=roleManager.js.map