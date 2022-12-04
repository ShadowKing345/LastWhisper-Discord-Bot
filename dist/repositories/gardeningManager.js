import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./repository.js";
import { GardeningModuleConfig } from "../entities/gardeningManager/index.js";
import { repository } from "../utils/decorators/index.js";
let GardeningManagerRepository = class GardeningManagerRepository extends Repository {
    constructor(db) {
        super(db, GardeningModuleConfig);
    }
};
GardeningManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], GardeningManagerRepository);
export { GardeningManagerRepository };
//# sourceMappingURL=gardeningManager.js.map