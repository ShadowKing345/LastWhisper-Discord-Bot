import {Collection, Filter} from "mongodb";
import {Database} from "../config/databaseConfiguration.js";
import {Buff, BuffManagerConfig, Days, MessageSettings, Week} from "../models/buffManager.model.js";
import {injectable} from "tsyringe";

@injectable()
export class BuffManagerConfigRepository {
    private readonly collectionName: string = "buff_manager";
    private collection: Collection<BuffManagerConfig>

    constructor(private db: Database) {
        this.collection = db.collection(this.collectionName);
    }

    public async save(config: BuffManagerConfig): Promise<BuffManagerConfig> {
        const result = await this.collection.findOneAndReplace({guildId: config.guildId}, config, {upsert: true});

        return result.ok ? this.sanitiseOutput(config) : null;
    }

    public async findOne(filter: Filter<BuffManagerConfig>): Promise<BuffManagerConfig> {
        return this.sanitiseOutput(await this.collection.findOne(filter));
    }

    public async find(filter: Filter<BuffManagerConfig>): Promise<BuffManagerConfig[]> {
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
