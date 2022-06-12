import { injectable } from "tsyringe";

import { Database } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { deepMerge } from "../shared/utils.js";
import { BuffManagerConfig } from "./models/index.js";

@injectable()
export class BuffManagerRepository extends BasicRepository<BuffManagerConfig> {
    private readonly collectionName: string = "buff_manager";

    constructor(private db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig {
        return deepMerge(new BuffManagerConfig(), config);
    }
}
