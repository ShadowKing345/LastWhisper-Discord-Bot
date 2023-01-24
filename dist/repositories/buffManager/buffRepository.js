import { __decorate, __metadata } from "tslib";
import { DatabaseService } from "../../config/index.js";
import { Buff } from "../../entities/buffManager/index.js";
import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../base/repository.js";
let BuffRepository = class BuffRepository extends Repository {
    constructor(db) {
        super(db, Buff);
    }
};
BuffRepository = __decorate([
    repository(),
    __metadata("design:paramtypes", [DatabaseService])
], BuffRepository);
export { BuffRepository };
//# sourceMappingURL=buffRepository.js.map