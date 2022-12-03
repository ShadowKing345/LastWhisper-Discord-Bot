import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { GardeningModuleConfig } from "../entities/gardening_manager/index.js";
export declare class GardeningManagerRepository extends Repository<GardeningModuleConfig> {
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=gardeningManager.d.ts.map