import {Database} from "../config/databaseConfiguration.js";
import {Buff, BuffManagerConfig, Days, MessageSettings, Week} from "../models/buffManager.model.js";
import {injectable} from "tsyringe";
import {BasicRepository} from "./basicRepository.js";

@injectable()
export class BuffManagerConfigRepository extends BasicRepository<BuffManagerConfig> {
    private readonly collectionName: string = "buff_manager";

    constructor(private db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig {
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
