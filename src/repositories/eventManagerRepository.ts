import {Collection, Filter} from "mongodb";
import {EventManagerConfig} from "../models/eventManager";
import {DB} from "../config/databaseConfiguration";

export class EventManagerRepository {
    private static readonly collectionName: string = "event_manager";
    private collection: Collection<EventManagerConfig>

    constructor() {}

    private async validate() {
        if (!this.collection) this.collection = await DB.collection(EventManagerRepository.collectionName);
    }

    public async save(config: EventManagerConfig): Promise<EventManagerConfig> {
        await this.validate();
        let result = await this.collection.findOneAndReplace({guildId: config.guildId}, config, {upsert: true});

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

        let bulk = this.collection.initializeOrderedBulkOp();
        configs.forEach(config => bulk.find({guildId: config.guildId}).replaceOne(config));

        await bulk.execute();
    }
}