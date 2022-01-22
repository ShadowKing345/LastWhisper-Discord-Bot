"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuffManagerConfigRepository = void 0;
const databaseConfiguration_1 = require("../config/databaseConfiguration");
class BuffManagerConfigRepository {
    constructor() { }
    async validate() {
        if (!this.collection)
            this.collection = await databaseConfiguration_1.DB.collection(BuffManagerConfigRepository.collectionName);
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
}
exports.BuffManagerConfigRepository = BuffManagerConfigRepository;
BuffManagerConfigRepository.collectionName = "buff_manager";
