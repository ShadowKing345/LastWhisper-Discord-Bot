import {Collection, Filter} from "mongodb";
import {DB} from "../config/databaseConfiguration";
import {RoleManagerConfig} from "../models/roleManager";

export class RoleManagerConfigRepository {
    private static readonly collectionName: string = "role_manager";
    private collection: Collection<RoleManagerConfig>

    constructor() {}

    private async validate() {
        if (!this.collection) this.collection = await DB.collection(RoleManagerConfigRepository.collectionName);
    }

    public async save(config: RoleManagerConfig): Promise<RoleManagerConfig> {
        await this.validate();
        let result = await this.collection.findOneAndReplace({guildId: config.guildId}, config, {upsert: true});

        return result.ok ? config : null;
    }

    public async findOne(filter: Filter<RoleManagerConfig>): Promise<RoleManagerConfig> {
        await this.validate();
        return await this.collection.findOne(filter);
    }

    public async find(filter: Filter<RoleManagerConfig>): Promise<RoleManagerConfig[]>{
        await this.validate();
        return await this.collection.find(filter).toArray();
    }
}