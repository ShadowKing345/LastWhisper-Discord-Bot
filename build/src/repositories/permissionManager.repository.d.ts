import { Database } from "../config/databaseConfiguration.js";
import { PermissionManagerConfig } from "../models/permissionManagerConfig.model.js";
import { BasicRepository } from "./basicRepository.js";
export declare class PermissionManagerRepository extends BasicRepository<PermissionManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: PermissionManagerConfig): PermissionManagerConfig;
}
//# sourceMappingURL=permissionManager.repository.d.ts.map