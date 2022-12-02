import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { GardeningModuleConfig } from "../entities/gardening_manager/index.js";
export declare class GardeningManagerRepository extends Repository<GardeningModuleConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof GardeningModuleConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=gardeningManager.d.ts.map