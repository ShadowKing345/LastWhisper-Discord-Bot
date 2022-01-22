"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManagerRepository = void 0;
const databaseConfiguration_1 = require("../config/databaseConfiguration");
class EventManagerRepository {
    constructor() { }
    async validate() {
        if (!this.collection)
            this.collection = await databaseConfiguration_1.DB.collection(EventManagerRepository.collectionName);
    }
    async save(config) {
        await this.validate();
        let result = await this.collection.findOneAndReplace({ guildId: config.guildId }, config, { upsert: true });
        return result.ok ? config : null;
    }
    async findOne(filter) {
        await this.validate();
        return await this.collection.findOne(filter);
    }
    async find(filter) {
        await this.validate();
        return await this.collection.find(filter).toArray();
    }
    async bulkSave(configs) {
        if (configs.length <= 0)
            return;
        await this.validate();
        let bulk = this.collection.initializeOrderedBulkOp();
        configs.forEach(config => bulk.find({ guildId: config.guildId }).replaceOne(config));
        await bulk.execute();
    }
}
exports.EventManagerRepository = EventManagerRepository;
EventManagerRepository.collectionName = "event_manager";
