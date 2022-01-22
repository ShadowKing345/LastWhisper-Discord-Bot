"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManagerConfigService = void 0;
const eventManagerRepository_1 = require("../repositories/eventManagerRepository");
const eventManager_1 = require("../models/eventManager");
class EventManagerConfigService {
    constructor() {
        this.repo = new eventManagerRepository_1.EventManagerRepository();
    }
    async findOne(id) {
        return this.repo.findOne({ guildId: id });
    }
    async findOneOrCreate(id) {
        let result = await this.repo.findOne({ guildId: id });
        if (result)
            return result;
        result = new eventManager_1.EventManagerConfig();
        result.guildId = id;
        return await this.repo.save(result);
    }
    async update(config) {
        return this.repo.save(config);
    }
    async getAll() {
        return this.repo.find({});
    }
    async bulkUpdate(alteredConfigs) {
    }
}
exports.EventManagerConfigService = EventManagerConfigService;
