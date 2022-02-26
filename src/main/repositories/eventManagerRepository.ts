import {Collection, Filter} from "mongodb";
import {EventManagerConfig} from "../models/eventManager.model.js";
import {DB} from "../config/databaseConfiguration.js";

export class EventManagerRepository {
    private static readonly collectionName: string = "event_manager";
    private collection: Collection<EventManagerConfig>

    private async validate() {
        if (!this.collection) this.collection = await DB.collection(EventManagerRepository.collectionName);
    }

    public async save(config: EventManagerConfig): Promise<EventManagerConfig> {
        await this.validate();
        const result = await this.collection.findOneAndReplace({guildId: config.guildId}, config, {upsert: true});

        return result.ok ? config : null;
    }

    public async findOne(filter: Filter<EventManagerConfig>): Promise<EventManagerConfig> {
        await this.validate();
        return await this.collection.findOne(filter);
    }

    public async find(filter: Filter<EventManagerConfig>): Promise<EventManagerConfig[]>{
        await this.validate();
        return await this.collection.find(filter).toArray();
    }

    public async bulkSave(configs: EventManagerConfig[]) {
        if (configs.length <= 0) return;
        await this.validate();

        const bulk = this.collection.initializeOrderedBulkOp();
        configs.forEach(config => bulk.find({guildId: config.guildId}).replaceOne(config));

        await bulk.execute();
    }
}