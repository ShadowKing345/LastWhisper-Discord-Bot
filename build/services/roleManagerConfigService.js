var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RoleManagerConfigRepository } from "../repositories/roleManagerConfigRepository.js";
import { RoleManagerConfig } from "../models/roleManager.model.js";
export class RoleManagerConfigService {
    constructor() {
        this.repo = new RoleManagerConfigRepository();
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.findOne({ guildId: id });
        });
    }
    findOneOrCreate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.repo.findOne({ guildId: id });
            if (result)
                return result;
            result = new RoleManagerConfig();
            result.guildId = id;
            return yield this.repo.save(result);
        });
    }
    update(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.save(config);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.find({});
        });
    }
}
//# sourceMappingURL=roleManagerConfigService.js.map