import { injectable } from "tsyringe";

import { Database } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { deepMerge } from "../shared/utils.js";
import { GardeningConfig } from "./models/index.js";

@injectable()
export class GardeningManagerRepository extends BasicRepository<GardeningConfig> {
    private readonly collectionName: string = "gardening_manager";

    constructor(protected db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: GardeningConfig): GardeningConfig {
        return deepMerge(new GardeningConfig(), config);
    }
}
