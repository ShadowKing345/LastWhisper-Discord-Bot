import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { RoleManagerConfig } from "../models/roleManager.js";
export declare class RoleManagerRepository extends RepositoryBase<RoleManagerConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof RoleManagerConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=roleManager.d.ts.map