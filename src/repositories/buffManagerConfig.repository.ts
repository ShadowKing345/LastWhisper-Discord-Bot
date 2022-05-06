import { injectable } from "tsyringe";

import { Database } from "../config/databaseConfiguration.js";
import { BuffManagerConfig } from "../models/buffManager.model.js";
import { deepMerge } from "../utils/utils.js";
import { BasicRepository } from "./basicRepository.js";

@injectable()
export class BuffManagerConfigRepository extends BasicRepository<BuffManagerConfig> {
    private readonly collectionName: string = "buff_manager";

    constructor(private db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig {
        return deepMerge(new BuffManagerConfig(), config);
    }
}
