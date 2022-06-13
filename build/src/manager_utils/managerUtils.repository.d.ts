import { Collection } from "mongodb";
import { DatabaseConfiguration } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { ManagerUtilsConfig } from "./managerUtils.model.js";
export declare class ManagerUtilsRepository extends BasicRepository<ManagerUtilsConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfiguration);
    protected sanitiseOutput(config: ManagerUtilsConfig): ManagerUtilsConfig;
    protected get collection(): Collection<ManagerUtilsConfig>;
}
//# sourceMappingURL=managerUtils.repository.d.ts.map