import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { BasicRepository } from "../utils/basicRepository.js";
import { deepMerge } from "../utils/index.js";
import { BuffManagerConfig } from "./models/index.js";

@singleton()
export class BuffManagerRepository extends BasicRepository<BuffManagerConfig> {
    private readonly collectionName: string = "buff_manager";

    constructor(private db: DatabaseConfigurationService) {
        super();
    }

    protected sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig {
        return deepMerge(new BuffManagerConfig(), config);
    }

    protected get collection(): Collection<BuffManagerConfig> {
        return this.db?.db?.collection(this.collectionName);
    }
}
