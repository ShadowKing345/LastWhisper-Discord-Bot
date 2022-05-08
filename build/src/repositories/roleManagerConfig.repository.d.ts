import { Database } from "../config/databaseConfiguration.js";
import { RoleManagerConfig } from "../models/roleManager.model.js";
import { BasicRepository } from "./basicRepository.js";
export declare class RoleManagerConfigRepository extends BasicRepository<RoleManagerConfig> {
    protected db: Database;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: RoleManagerConfig): RoleManagerConfig;
}
//# sourceMappingURL=roleManagerConfig.repository.d.ts.map