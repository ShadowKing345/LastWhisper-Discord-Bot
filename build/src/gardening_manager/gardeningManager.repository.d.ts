import { Collection } from "mongodb";
import { DatabaseConfiguration } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { GardeningConfig } from "./models/index.js";
export declare class GardeningManagerRepository extends BasicRepository<GardeningConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfiguration);
    protected sanitiseOutput(config: GardeningConfig): GardeningConfig;
    protected get collection(): Collection<GardeningConfig>;
}
//# sourceMappingURL=gardeningManager.repository.d.ts.map