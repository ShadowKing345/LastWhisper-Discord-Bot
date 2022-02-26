import {Collection, Filter} from "mongodb";
import {GardeningConfig} from "../models/gardeningConfig.model.js";
import {DB} from "../config/databaseConfiguration.js";

export class GardeningConfigRepository {
    private static readonly collectionName: string = "gardening_manager";
    private collection: Collection<GardeningConfig>
    
    private async validate() {
        if (!this.collection) this.collection = await DB.collection(GardeningConfigRepository.collectionName);
    }

    public async save(config: GardeningConfig): Promise<GardeningConfig> {
        await this.validate();
        const result = await this.collection.findOneAndReplace({guildId: config.guildId}, config, {upsert: true});

        return result.ok ? config : null;
    }

    public async findOne(filter: Filter<GardeningConfig>): Promise<GardeningConfig> {
        await this.validate();
        return await this.collection.findOne(filter);
    }

    public async find(filter: Filter<GardeningConfig>): Promise<GardeningConfig[]>{
        await this.validate();
        return await this.collection.find(filter).toArray();
    }
}