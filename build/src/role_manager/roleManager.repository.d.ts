import { Collection } from "mongodb";
import { DatabaseConfiguration } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { RoleManagerConfig } from "./roleManager.model.js";
export declare class RoleManagerRepository extends BasicRepository<RoleManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfiguration);
    protected sanitiseOutput(config: RoleManagerConfig): RoleManagerConfig;
    protected get collection(): Collection<RoleManagerConfig>;
}
//# sourceMappingURL=roleManager.repository.d.ts.map