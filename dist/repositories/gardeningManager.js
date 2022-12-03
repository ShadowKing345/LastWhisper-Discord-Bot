import { __decorate, __metadata } from "tslib";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { GardeningModuleConfig } from "../entities/gardening_manager/index.js";
import { repository } from "../utils/decorators/index.js";
let GardeningManagerRepository = class GardeningManagerRepository extends Repository {
    constructor(db) {
        super(db, GardeningModuleConfig);
    }
};
GardeningManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], GardeningManagerRepository);
export { GardeningManagerRepository };
//# sourceMappingURL=gardeningManager.js.map