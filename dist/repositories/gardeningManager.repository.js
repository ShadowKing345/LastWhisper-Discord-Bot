import { __decorate, __metadata } from "tslib";
import { singleton } from "tsyringe";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { GardeningModuleConfig } from "../models/gardening_manager/index.js";
let GardeningManagerRepository = class GardeningManagerRepository extends RepositoryBase {
    collectionName = "gardening_manager";
    mappingObject = GardeningModuleConfig;
    constructor(db) {
        super(db);
    }
};
GardeningManagerRepository = __decorate([
    singleton(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], GardeningManagerRepository);
export { GardeningManagerRepository };
//# sourceMappingURL=gardeningManager.repository.js.map