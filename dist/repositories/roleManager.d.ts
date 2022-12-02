import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { RoleManagerConfig } from "../entities/roleManager.js";
export declare class RoleManagerRepository extends Repository<RoleManagerConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof RoleManagerConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=roleManager.d.ts.map