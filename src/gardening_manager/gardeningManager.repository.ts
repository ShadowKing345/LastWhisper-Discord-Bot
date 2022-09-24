import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { BasicRepository } from "../utils/basicRepository.js";
import { deepMerge } from "../utils/index.js";
import { GardeningConfig } from "./models/index.js";

@singleton()
export class GardeningManagerRepository extends BasicRepository<GardeningConfig> {
    private readonly collectionName: string = "gardening_manager";

    constructor(private db: DatabaseConfigurationService) {
        super();
    }

    protected sanitiseOutput(config: GardeningConfig): GardeningConfig {
        return deepMerge(new GardeningConfig(), config);
    }

    protected get collection(): Collection<GardeningConfig> {
        return this.db?.db?.collection(this.collectionName);
    }
}
