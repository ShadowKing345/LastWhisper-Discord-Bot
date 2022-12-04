import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../../config/databaseService.js";
import { Repository } from "../repository.js";
import { BuffManagerConfig } from "../../entities/buffManager/index.js";
import { repository } from "../../utils/decorators/index.js";
let BuffManagerRepository = class BuffManagerRepository extends Repository {
    constructor(db) {
        super(db, BuffManagerConfig);
    }
};
BuffManagerRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], BuffManagerRepository);
export { BuffManagerRepository };
//# sourceMappingURL=buffManager.js.map