import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfiguration } from "../utils/config/databaseConfiguration.js";
import { BasicRepository } from "../utils/basicRepository.js";
import { deepMerge } from "../utils/utils.js";
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
