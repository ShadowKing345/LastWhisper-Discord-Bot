import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { PermissionManagerConfig } from "../models/permission_manager/index.js";
export declare class PermissionManagerRepository extends RepositoryBase<PermissionManagerConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof PermissionManagerConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=permissionManager.d.ts.map