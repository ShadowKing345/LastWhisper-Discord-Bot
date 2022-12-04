import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./repository.js";
import { RoleManagerConfig } from "../entities/roleManager.js";
import { repository } from "../utils/decorators/index.js";
let RoleManagerRepository = class RoleManagerRepository extends Repository {
    constructor(db) {
        super(db, RoleManagerConfig);
    }
};
RoleManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], RoleManagerRepository);
export { RoleManagerRepository };
//# sourceMappingURL=roleManager.js.map