import {Collection, Filter} from "mongodb";
import {DB} from "../config/databaseConfiguration";
import {BuffManagerConfig} from "../models/buffManager";
import {Service} from "typedi";

@Service()
export class BuffManagerConfigRepository {
    private static readonly collectionName: string = "buff_manager";
    private collection: Collection<BuffManagerConfig>

    constructor() {}

    private async validate() {
        if (!this.collection) this.collection = await DB.collection(BuffManagerConfigRepository.collectionName);
    }

    public async save(config: BuffManagerConfig): Promise<BuffManagerConfig> {
        await this.validate();
        let result = await this.collection.findOneAndReplace({guildId: config.guildId}, config, {upsert: true});

        return result.ok ? config : null;
    }

    public async findOne(filter: Filter<BuffManagerConfig>): Promise<BuffManagerConfig> {
        await this.validate();
        return await this.collection.findOne(filter);
    }

    public async find(filter: Filter<BuffManagerConfig>): Promise<BuffManagerConfig[]>{
        await this.validate();
        return await this.collection.find(filter).toArray();
    }
}