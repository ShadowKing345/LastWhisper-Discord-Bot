import { injectable } from "tsyringe";

import { Database } from "../config/databaseConfiguration.js";
import { GardeningConfig } from "../models/gardeningConfig.model.js";
import { BasicRepository } from "./basicRepository.js";

@injectable()
export class GardeningConfigRepository extends BasicRepository<GardeningConfig> {
    private readonly collectionName: string = "gardening_manager";

    constructor(protected db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: GardeningConfig): GardeningConfig {
        return Object.assign(new GardeningConfig(), config);
    }
}
