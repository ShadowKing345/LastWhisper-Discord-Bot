import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfiguration } from "../utils/config/databaseConfiguration.js";
import { BasicRepository } from "../utils/basicRepository.js";
import { deepMerge } from "../utils/utils.js";
import { GardeningConfig } from "./models/index.js";

@singleton()
export class GardeningManagerRepository extends BasicRepository<GardeningConfig> {
    private readonly collectionName: string = "gardening_manager";

    constructor(private db: DatabaseConfiguration) {
        super();
    }

    protected sanitiseOutput(config: GardeningConfig): GardeningConfig {
        return deepMerge(new GardeningConfig(), config);
    }

    protected get collection(): Collection<GardeningConfig> {
        return this.db?.db?.collection(this.collectionName);
    }
}
