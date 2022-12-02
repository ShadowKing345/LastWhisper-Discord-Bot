import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { PermissionManagerConfig } from "../entities/permission_manager/index.js";
export declare class PermissionManagerRepository extends Repository<PermissionManagerConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof PermissionManagerConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=permissionManager.d.ts.map