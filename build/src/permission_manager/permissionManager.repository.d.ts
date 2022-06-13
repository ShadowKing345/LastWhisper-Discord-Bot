import { Collection } from "mongodb";
import { DatabaseConfiguration } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { PermissionManagerConfig } from "./models/index.js";
export declare class PermissionManagerRepository extends BasicRepository<PermissionManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfiguration);
    protected sanitiseOutput(config: PermissionManagerConfig): PermissionManagerConfig;
    protected get collection(): Collection<PermissionManagerConfig>;
}
//# sourceMappingURL=permissionManager.repository.d.ts.map