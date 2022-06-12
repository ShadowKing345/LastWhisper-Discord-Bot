import { Database } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { RoleManagerConfig } from "./roleManager.model.js";
export declare class RoleManagerRepository extends BasicRepository<RoleManagerConfig> {
    protected db: Database;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: RoleManagerConfig): RoleManagerConfig;
}
//# sourceMappingURL=roleManager.repository.d.ts.map