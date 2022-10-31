import { __decorate, __metadata } from "tslib";
import { singleton } from "tsyringe";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";
let BuffManagerRepository = class BuffManagerRepository extends RepositoryBase {
    collectionName = "buff_manager";
    mappingObject = BuffManagerConfig;
    constructor(db) {
        super(db);
    }
};
BuffManagerRepository = __decorate([
    singleton(),
    __metadata("design:paramtypes", [DatabaseConfigurationService])
], BuffManagerRepository);
export { BuffManagerRepository };
//# sourceMappingURL=buffManager.repository.js.map