import { Database } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { GardeningConfig } from "./models/index.js";
export declare class GardeningManagerRepository extends BasicRepository<GardeningConfig> {
    protected db: Database;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: GardeningConfig): GardeningConfig;
}
//# sourceMappingURL=gardeningManager.repository.d.ts.map