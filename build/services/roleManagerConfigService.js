"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleManagerConfigService = void 0;
const roleManagerConfigRepository_1 = require("../repositories/roleManagerConfigRepository");
const roleManager_1 = require("../models/roleManager");
class RoleManagerConfigService {
    constructor() {
        this.repo = new roleManagerConfigRepository_1.RoleManagerConfigRepository();
    }
    async findOne(id) {
        return this.repo.findOne({ guildId: id });
    }
    async findOneOrCreate(id) {
        let result = await this.repo.findOne({ guildId: id });
        if (result)
            return result;
        result = new roleManager_1.RoleManagerConfig();
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
exports.RoleManagerConfigService = RoleManagerConfigService;
