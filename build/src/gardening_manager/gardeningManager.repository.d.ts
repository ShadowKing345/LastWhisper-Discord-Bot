import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/repository/repositoryBase.js";
import { GardeningConfig } from "./models/index.js";
export declare class GardeningManagerRepository extends RepositoryBase<GardeningConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfigurationService);
    protected sanitiseOutput(config: GardeningConfig): GardeningConfig;
    protected get collection(): Collection<GardeningConfig>;
}
//# sourceMappingURL=gardeningManager.repository.d.ts.map