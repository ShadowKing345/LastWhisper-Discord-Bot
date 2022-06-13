import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfiguration } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { deepMerge } from "../shared/utils.js";
import { BuffManagerConfig } from "./models/index.js";

@singleton()
export class BuffManagerRepository extends BasicRepository<BuffManagerConfig> {
    private readonly collectionName: string = "buff_manager";

    constructor(private db: DatabaseConfiguration) {
        super();
    }

    protected sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig {
        return deepMerge(new BuffManagerConfig(), config);
    }

    protected get collection(): Collection<BuffManagerConfig> {
        return this.db?.db?.collection(this.collectionName);
    }
}
