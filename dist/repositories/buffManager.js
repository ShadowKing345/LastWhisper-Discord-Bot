import { __decorate, __metadata } from "tslib";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { BuffManagerConfig } from "../entities/buff_manager/index.js";
import { repository } from "../utils/decorators/index.js";
let BuffManagerRepository = class BuffManagerRepository extends Repository {
    collectionName = "buff_manager";
    mappingObject = BuffManagerConfig;
    constructor(db) {
        super(db);
    }
};
BuffManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], BuffManagerRepository);
export { BuffManagerRepository };
//# sourceMappingURL=buffManager.js.map