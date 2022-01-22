"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuffManagerConfigService = void 0;
const buffManager_1 = require("../models/buffManager");
const buffManagerConfigRepository_1 = require("../repositories/buffManagerConfigRepository");
class BuffManagerConfigService {
    constructor() {
        this.repo = new buffManagerConfigRepository_1.BuffManagerConfigRepository();
    }
    async findOne(id) {
        return this.repo.findOne({ guildId: id });
    }
    async findOneOrCreate(id) {
        let result = await this.repo.findOne({ guildId: id });
        if (result)
            return result;
        result = new buffManager_1.BuffManagerConfig();
        result.guildId = id;
        return await this.repo.save(result);
    }
    async update(config) {
        return this.repo.save(config);
    }
    async getAll() {
        return this.repo.find({});
    }
}
exports.BuffManagerConfigService = BuffManagerConfigService;
