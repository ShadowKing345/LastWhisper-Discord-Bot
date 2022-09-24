import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/repository/repositoryBase.js";
import { ManagerUtilsConfig } from "./managerUtils.model.js";
export declare class ManagerUtilsRepository extends RepositoryBase<ManagerUtilsConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfigurationService);
    protected sanitiseOutput(config: ManagerUtilsConfig): ManagerUtilsConfig;
    protected get collection(): Collection<ManagerUtilsConfig>;
}
//# sourceMappingURL=managerUtils.repository.d.ts.map