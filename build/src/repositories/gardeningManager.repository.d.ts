import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { GardeningModuleConfig } from "../models/gardening_manager/index.js";
export declare class GardeningManagerRepository extends RepositoryBase<GardeningModuleConfig> {
    private readonly collectionName;
    protected readonly sanitizedObject: typeof GardeningModuleConfig;
    protected readonly collection: Collection<GardeningModuleConfig>;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=gardeningManager.repository.d.ts.map