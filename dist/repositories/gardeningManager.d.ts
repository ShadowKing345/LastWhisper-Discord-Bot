import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { GardeningModuleConfig } from "../models/gardening_manager/index.js";
export declare class GardeningManagerRepository extends RepositoryBase<GardeningModuleConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof GardeningModuleConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=gardeningManager.d.ts.map