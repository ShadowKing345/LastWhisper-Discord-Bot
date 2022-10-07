import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { GardeningModuleConfig } from "../models/gardening_manager/index.js";
export declare class GardeningManagerRepository extends RepositoryBase<GardeningModuleConfig> {
    protected readonly collectionName: string;
    protected readonly sanitizedObject: typeof GardeningModuleConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=gardeningManager.repository.d.ts.map