import {Collection, Filter} from "mongodb";
import {DB} from "../config/databaseConfiguration.js";
import {BuffManagerConfig, Buff, Days, MessageSettings, Week} from "../models/buffManager.js";

export class BuffManagerConfigRepository {
    private static readonly collectionName: string = "buff_manager";
    private collection: Collection<BuffManagerConfig>

    constructor() {
    }

    private async validate() {
        if (!this.collection) this.collection = await DB.collection(BuffManagerConfigRepository.collectionName);
    }

    public async save(config: BuffManagerConfig): Promise<BuffManagerConfig> {
        await this.validate();
        let result = await this.collection.findOneAndReplace({guildId: config.guildId}, config, {upsert: true});

        return result.ok ? this.sanitiseOutput(config) : null;
    }

    public async findOne(filter: Filter<BuffManagerConfig>): Promise<BuffManagerConfig> {
        await this.validate();
        return this.sanitiseOutput(await this.collection.findOne(filter));
    }

    public async find(filter: Filter<BuffManagerConfig>): Promise<BuffManagerConfig[]> {
        await this.validate();
        return (await this.collection.find(filter).toArray()).map(config => this.sanitiseOutput(config));
    }

    private sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig {
        config = Object.assign(new BuffManagerConfig(), config);
        config.messageSettings = Object.assign(new MessageSettings(), config.messageSettings);
        config.buffs = config.buffs.map(day => Object.assign(new Buff(), day));
        config.weeks = config.weeks.map(week => {
            week = Object.assign(new Week(), week);
            week.days = Object.assign(new Days(), week.days);
            return week;
        });

        return config;
    }
}