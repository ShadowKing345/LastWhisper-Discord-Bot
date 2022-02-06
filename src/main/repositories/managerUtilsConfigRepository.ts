import {Collection, Filter} from "mongodb";
import {DB} from "../config/databaseConfiguration.js";
import {ManagerUtilsConfig} from "../models/mangerUtils.js";

export class ManagerUtilsConfigRepository {
    private static readonly collectionName: string = "manager_utils";
    private collection: Collection<ManagerUtilsConfig>

    constructor() {}

    private async validate() {
        if (!this.collection) this.collection = await DB.collection(ManagerUtilsConfigRepository.collectionName);
    }

    public async save(config: ManagerUtilsConfig): Promise<ManagerUtilsConfig> {
        await this.validate();
        let result = await this.collection.findOneAndReplace({guildId: config.guildId}, config, {upsert: true});

        return result.ok ? config : null;
    }

    public async findOne(filter: Filter<ManagerUtilsConfig>): Promise<ManagerUtilsConfig> {
        await this.validate();
        return await this.collection.findOne(filter);
    }

    public async find(filter: Filter<ManagerUtilsConfig>): Promise<ManagerUtilsConfig[]>{
        await this.validate();
        return await this.collection.find(filter).toArray();
    }
}