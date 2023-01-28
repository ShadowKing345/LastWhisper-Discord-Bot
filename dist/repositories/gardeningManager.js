import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../config/index.js";
import { GardeningModuleConfig } from "../entities/gardeningManager/index.js";
import { repository } from "../decorators/index.js";
import { Repository } from "./base/repository.js";
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