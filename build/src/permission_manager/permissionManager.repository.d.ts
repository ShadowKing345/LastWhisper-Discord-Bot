import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/repository/repositoryBase.js";
import { PermissionManagerConfig } from "./models/index.js";
export declare class PermissionManagerRepository extends RepositoryBase<PermissionManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfigurationService);
    protected sanitiseOutput(config: PermissionManagerConfig): PermissionManagerConfig;
    protected get collection(): Collection<PermissionManagerConfig>;
}
//# sourceMappingURL=permissionManager.repository.d.ts.map