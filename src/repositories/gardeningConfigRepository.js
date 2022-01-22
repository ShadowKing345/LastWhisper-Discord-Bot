"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardeningConfigRepository = void 0;
const databaseConfiguration_1 = require("../config/databaseConfiguration");
class GardeningConfigRepository {
    constructor() { }
    async validate() {
        if (!this.collection)
            this.collection = await databaseConfiguration_1.DB.collection(GardeningConfigRepository.collectionName);
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
exports.GardeningConfigRepository = GardeningConfigRepository;
GardeningConfigRepository.collectionName = "gardening_manager";
