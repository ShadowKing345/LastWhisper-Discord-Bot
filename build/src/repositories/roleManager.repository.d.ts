import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { RoleManagerConfig } from "../models/role_manager/roleManager.model.js";
export declare class RoleManagerRepository extends RepositoryBase<RoleManagerConfig> {
    private readonly collectionName;
    protected readonly sanitizedObject: typeof RoleManagerConfig;
    protected readonly collection: Collection<RoleManagerConfig>;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=roleManager.repository.d.ts.map