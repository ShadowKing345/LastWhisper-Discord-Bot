import { __decorate, __metadata } from "tslib";
import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { BuffManagerConfig } from "../entities/buff_manager/index.js";
import { repository } from "../utils/decorators/index.js";
let BuffManagerRepository = class BuffManagerRepository extends Repository {
    constructor(db) {
        super(db, BuffManagerConfig);
    }
};
BuffManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], BuffManagerRepository);
export { BuffManagerRepository };
//# sourceMappingURL=buffManager.js.map