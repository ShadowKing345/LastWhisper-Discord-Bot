import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { PermissionManagerConfig } from "../entities/permission_manager/index.js";
export declare class PermissionManagerRepository extends Repository<PermissionManagerConfig> {
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=permissionManager.d.ts.map