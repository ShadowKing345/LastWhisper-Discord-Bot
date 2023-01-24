import { DatabaseService } from "../config/databaseService.js";
import { GardeningModuleConfig } from "../entities/gardeningManager/index.js";
import { Repository } from "./base/repository.js";
export declare class GardeningManagerRepository extends Repository<GardeningModuleConfig> {
    constructor(db: DatabaseService);
}
//# sourceMappingURL=gardeningManager.d.ts.map