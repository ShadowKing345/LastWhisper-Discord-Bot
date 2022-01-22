"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardeningConfigService = void 0;
const gardeningConfigModel_1 = require("../models/gardeningConfigModel");
const gardeningConfigRepository_1 = require("../repositories/gardeningConfigRepository");
class GardeningConfigService {
    constructor() {
        this.repo = new gardeningConfigRepository_1.GardeningConfigRepository();
    }
    async findOne(id) {
        return this.repo.findOne({ guildId: id });
    }
    async findOneOrCreate(id) {
        let result = await this.repo.findOne({ guildId: id });
        if (result)
            return result;
        result = new gardeningConfigModel_1.GardeningConfig();
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
exports.GardeningConfigService = GardeningConfigService;
