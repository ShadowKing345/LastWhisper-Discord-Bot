import { Database } from "../config/databaseConfiguration.js";
import { GardeningConfig } from "../models/gardeningConfig.model.js";
import { BasicRepository } from "./basicRepository.js";
export declare class GardeningConfigRepository extends BasicRepository<GardeningConfig> {
    protected db: Database;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: GardeningConfig): GardeningConfig;
}
//# sourceMappingURL=gardeningConfig.repository.d.ts.map