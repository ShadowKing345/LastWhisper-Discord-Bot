import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/repository/repositoryBase.js";
import { RoleManagerConfig } from "./roleManager.model.js";
export declare class RoleManagerRepository extends RepositoryBase<RoleManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfigurationService);
    protected sanitiseOutput(config: RoleManagerConfig): RoleManagerConfig;
    protected get collection(): Collection<RoleManagerConfig>;
}
//# sourceMappingURL=roleManager.repository.d.ts.map