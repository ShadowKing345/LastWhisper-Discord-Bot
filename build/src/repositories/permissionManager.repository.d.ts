import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { PermissionManagerConfig } from "../models/permission_manager/index.js";
export declare class PermissionManagerRepository extends RepositoryBase<PermissionManagerConfig> {
    private readonly collectionName;
    protected readonly sanitizedObject: typeof PermissionManagerConfig;
    protected readonly collection: Collection<PermissionManagerConfig>;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=permissionManager.repository.d.ts.map