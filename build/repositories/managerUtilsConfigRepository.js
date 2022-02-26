var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DB } from "../config/databaseConfiguration.js";
export class ManagerUtilsConfigRepository {
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.collection)
                this.collection = yield DB.collection(ManagerUtilsConfigRepository.collectionName);
        });
    }
    save(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate();
            const result = yield this.collection.findOneAndReplace({ guildId: config.guildId }, config, { upsert: true });
            return result.ok ? config : null;
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate();
            return yield this.collection.findOne(filter);
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate();
            return yield this.collection.find(filter).toArray();
        });
    }
}
ManagerUtilsConfigRepository.collectionName = "manager_utils";
//# sourceMappingURL=managerUtilsConfigRepository.js.map