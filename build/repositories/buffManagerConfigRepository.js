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
import { Buff, BuffManagerConfig, Days, MessageSettings, Week } from "../models/buffManager.model.js";
export class BuffManagerConfigRepository {
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.collection)
                this.collection = yield DB.collection(BuffManagerConfigRepository.collectionName);
        });
    }
    save(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate();
            const result = yield this.collection.findOneAndReplace({ guildId: config.guildId }, config, { upsert: true });
            return result.ok ? this.sanitiseOutput(config) : null;
        });
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate();
            return this.sanitiseOutput(yield this.collection.findOne(filter));
        });
    }
    find(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validate();
            return (yield this.collection.find(filter).toArray()).map(config => this.sanitiseOutput(config));
        });
    }
    sanitiseOutput(config) {
        config = Object.assign(new BuffManagerConfig(), config);
        config.messageSettings = Object.assign(new MessageSettings(), config.messageSettings);
        config.buffs = config.buffs.map(day => Object.assign(new Buff(), day));
        config.weeks = config.weeks.map(week => {
            week = Object.assign(new Week(), week);
            week.days = Object.assign(new Days(), week.days);
            return week;
        });
        return config;
    }
}
BuffManagerConfigRepository.collectionName = "buff_manager";
//# sourceMappingURL=buffManagerConfigRepository.js.map